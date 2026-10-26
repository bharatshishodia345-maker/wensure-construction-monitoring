import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  ProjectData,
  ContractorProfile,
  InspectionReport,
  Opportunity,
  NotificationItem,
} from '../types';
import {
  INITIAL_PROJECT,
  CONTRACTOR_DIRECTORY,
  SAMPLE_INSPECTION_REPORTS,
  CONTRACTOR_OPPORTUNITIES,
  INITIAL_NOTIFICATIONS,
} from '../data/demoData';
import { api } from '../services/api';

interface UserInfo {
  name: string;
  roleTitle: string;
  avatar: string;
  role: UserRole;
  email: string;
}

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface AppContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: UserInfo;
  project: ProjectData;
  contractors: ContractorProfile[];
  opportunities: Opportunity[];
  notifications: NotificationItem[];
  inspectionReports: InspectionReport[];
  activeFloor: 'ground' | 'first';
  setActiveFloor: (floor: 'ground' | 'first') => void;
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  submitWorkUpdate: (payload: {
    milestoneId: string;
    progressPercent: number;
    notes: string;
    photoTitle?: string;
    photoUrl?: string;
  }) => void;
  submitObservationResponse: (
    issueId: string,
    responseText: string,
    rectificationPlan?: string
  ) => void;
  expressOpportunityInterest: (opportunityId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  verifyInspectionReport: (reportId: string) => void;
  approveBudgetTranche: (txId: string) => void;
  resolveObservationAdmin: (issueId: string) => void;
  backendConnected: boolean;
  refreshProject: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('public');
  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [project, setProject] = useState<ProjectData>(() => {
    const saved = localStorage.getItem('wensure_project_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PROJECT;
      }
    }
    return INITIAL_PROJECT;
  });

  const [contractors, setContractors] = useState<ContractorProfile[]>(CONTRACTOR_DIRECTORY);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(CONTRACTOR_OPPORTUNITIES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [inspectionReports, setInspectionReports] = useState<InspectionReport[]>(SAMPLE_INSPECTION_REPORTS);
  const [activeFloor, setActiveFloor] = useState<'ground' | 'first'>('ground');
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Function to refresh project data from live FastAPI backend
  const refreshProject = async () => {
    try {
      const health = await api.checkHealth();
      if (health && health.status === 'healthy') {
        setBackendConnected(true);
        const backendProj = await api.getActiveProject();
        if (backendProj) {
          setProject((prev) => ({
            ...prev,
            name: backendProj.name || backendProj.title || prev.name,
            code: backendProj.slug || backendProj.project_code || prev.code,
            totalBudget: backendProj.total_budget ?? prev.totalBudget,
            recordedExpenditure: backendProj.spent_amount ?? backendProj.disbursed_budget ?? prev.recordedExpenditure,
            recordedProgress: backendProj.verified_percentage ?? backendProj.current_progress ?? prev.recordedProgress,
          }));
        }
        const notifs = await api.getNotifications();
        if (Array.isArray(notifs) && notifs.length > 0) {
          // Merge notifications
          setNotifications((prev) => {
            const mapped: NotificationItem[] = notifs.map((n: any) => ({
              id: n.id,
              title: n.title,
              description: n.message || n.description,
              timestamp: n.created_at ? new Date(n.created_at).toLocaleDateString() : 'Recent',
              category: (n.category || 'progress').toLowerCase() as any,
              isRead: n.read ?? n.is_read ?? false,
              priority: (n.priority || 'normal').toLowerCase() as any,
              linkTo: n.link || n.link_url || '/customer/dashboard',
            }));
            const existingIds = new Set(prev.map((p) => p.id));
            const fresh = mapped.filter((m) => !existingIds.has(m.id));
            return [...fresh, ...prev];
          });
        }
        const rawContractors = await api.getContractors();
        if (Array.isArray(rawContractors) && rawContractors.length > 0) {
          setContractors((prev) => {
            const mapped = rawContractors.map((c: any) => {
              const existing = prev.find((p) => p.id === c.id || p.companyName === c.company_name);
              return {
                id: c.id,
                companyName: c.company_name || existing?.companyName || 'Verified Builder',
                founderName: existing?.founderName || 'Founder & Director',
                avatarUrl: existing?.avatarUrl || 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?auto=format&fit=crop&w=256&q=80',
                heroImageUrl: existing?.heroImageUrl || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
                tagline: c.bio || existing?.tagline || 'Licensed Residential Builder',
                location: c.location || existing?.location || 'Pune, MH',
                establishedYear: existing?.establishedYear || 2014,
                specializations: existing?.specializations || [c.specialty || 'Civil RCC'],
                rating: c.rating || existing?.rating || 4.8,
                reviewCount: existing?.reviewCount || 34,
                verifiedTier: (existing?.verifiedTier || 'Independent Platinum') as any,
                verifiedProjectsCount: c.verified_milestones_count || existing?.verifiedProjectsCount || 12,
                ongoingProjectsCount: c.active_projects_count || existing?.ongoingProjectsCount || 3,
                totalConstructedSqFt: existing?.totalConstructedSqFt || '1,45,000 sq.ft',
                disputeRate: existing?.disputeRate || '0.0%',
                inspectionComplianceRate: existing?.inspectionComplianceRate || '98.5%',
                aboutText: c.bio || existing?.aboutText || 'Verified construction partner on WENSURE platform.',
                recentProjects: existing?.recentProjects || [],
                reviews: existing?.reviews || [],
              };
            });
            return mapped;
          });
        }
      } else {
        setBackendConnected(false);
      }
    } catch {
      setBackendConnected(false);
    }
  };

  // Sync with backend on startup
  useEffect(() => {
    refreshProject();
  }, []);

  // Sync project to local storage for demo persistence
  useEffect(() => {
    localStorage.setItem('wensure_project_data', JSON.stringify(project));
  }, [project]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const currentUser: UserInfo = React.useMemo(() => {
    switch (currentRole) {
      case 'customer':
        return {
          name: 'Bharat Shishodia',
          roleTitle: 'Homeowner',
          avatar: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?auto=format&fit=crop&w=256&q=80',
          role: 'customer',
          email: 'bharat@wensure.com',
        };
      case 'contractor':
        return {
          name: 'Rajesh Verma',
          roleTitle: 'Principal Contractor & Builder',
          avatar: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?auto=format&fit=crop&w=256&q=80',
          role: 'contractor',
          email: 'rajesh@vermaconstructions.in',
        };
      case 'admin':
        return {
          name: 'WENSURE Operations',
          roleTitle: 'Platform & Verification Lead',
          avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
          role: 'admin',
          email: 'audit-ops@wensure.in',
        };
      default:
        return {
          name: 'Guest Visitor',
          roleTitle: 'Exploring WENSURE',
          avatar: '',
          role: 'public',
          email: '',
        };
    }
  }, [currentRole]);

  const submitWorkUpdate = ({
    milestoneId,
    progressPercent,
    notes,
    photoTitle,
    photoUrl,
  }: {
    milestoneId: string;
    progressPercent: number;
    notes: string;
    photoTitle?: string;
    photoUrl?: string;
  }) => {
    setProject((prev) => {
      const updatedMilestones = prev.milestones.map((ms) => {
        if (ms.id === milestoneId) {
          const newActual = Math.min(100, Math.max(0, progressPercent));
          return {
            ...ms,
            actualProgress: newActual,
            status: newActual >= 100 ? ('completed' as const) : ('in_progress' as const),
            evidenceCount: ms.evidenceCount + (photoUrl ? 1 : 0),
          };
        }
        return ms;
      });

      // Recalculate average progress weighted across milestones
      const totalProgress = Math.round(
        updatedMilestones.reduce((acc, m) => acc + m.actualProgress, 0) / updatedMilestones.length
      );

      const newPhotos = [...prev.sitePhotos];
      if (photoUrl) {
        newPhotos.unshift({
          id: `PH-${Date.now()}`,
          url: photoUrl,
          title: photoTitle || 'Contractor Work Update Evidence',
          stage: 'Plaster & Services',
          date: '12 October 2026',
          locationTag: 'Grid Area',
          isVerified: false,
          notes: notes,
        });
      }

      return {
        ...prev,
        milestones: updatedMilestones,
        recordedProgress: totalProgress,
        scheduleVariance: totalProgress - prev.plannedProgress,
        sitePhotos: newPhotos,
      };
    });

    // Add notification
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: 'Contractor Work Progress Submitted',
      description: `Apex Structural Builders submitted update: ${notes.slice(0, 75)}...`,
      timestamp: 'Just now',
      category: 'progress',
      isRead: false,
      priority: 'normal',
      linkTo: '/customer/progress',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Synchronize with backend if connected; otherwise handle explicit demo mode
    if (backendConnected) {
      api.submitWorkUpdate({
        milestoneId,
        progressPercent,
        notes,
        photoTitle,
        photoUrl,
      })
        .then(() => {
          showToast('Work update synchronized with backend server.', 'success');
        })
        .catch((err) => {
          console.warn('[WENSURE API] Work update sync failed:', err);
          showToast('Failed to sync update with server. Work update retained in local sandbox.', 'warning');
        });
    } else {
      showToast('[Demo Mode] Work update recorded locally in sandbox session.', 'info');
    }
  };

  const submitObservationResponse = (
    issueId: string,
    responseText: string,
    rectificationPlan?: string
  ) => {
    setProject((prev) => {
      const updatedObs = prev.observations.map((obs) => {
        if (obs.id === issueId) {
          return {
            ...obs,
            contractorResponse: responseText,
            contractorResponseDate: '12 October 2026',
            rectificationPlan: rectificationPlan || obs.rectificationPlan,
            status: 'Rectification Submitted' as const,
          };
        }
        return obs;
      });
      return {
        ...prev,
        observations: updatedObs,
      };
    });

    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: `Contractor Response: ${issueId}`,
      description: `Rectification response submitted: "${responseText.slice(0, 60)}..."`,
      timestamp: 'Just now',
      category: 'observation',
      isRead: false,
      priority: 'high',
      linkTo: '/customer/issues',
    };
    setNotifications((prev) => [notif, ...prev]);

    // Synchronize with backend if connected; otherwise handle explicit demo mode
    if (backendConnected) {
      api.submitObservationResponse(issueId, responseText, rectificationPlan)
        .then(() => {
          showToast('Observation rectification submitted to server.', 'success');
        })
        .catch((err) => {
          console.warn('[WENSURE API] Observation response sync failed:', err);
          showToast('Failed to sync response with server. Response retained in local sandbox.', 'warning');
        });
    } else {
      showToast('[Demo Mode] Observation rectification submitted in local sandbox session.', 'info');
    }
  };

  const expressOpportunityInterest = (opportunityId: string) => {
    setOpportunities((prev) =>
      prev.map((opp) => {
        if (opp.id === opportunityId) {
          const nextState = !opp.interested;
          showToast(
            nextState
              ? 'Interest expressed! WENSURE operations informed the homeowner.'
              : 'Interest withdrawn.',
            nextState ? 'success' : 'info'
          );
          return {
            ...opp,
            interested: nextState,
            bidsCount: opp.bidsCount + (nextState ? 1 : -1),
          };
        }
        return opp;
      })
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    api.markNotificationRead(id).catch(() => {});
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    api.markAllNotificationsRead().catch(() => {});
    showToast('All notifications marked as read across portals.', 'info');
  };

  const verifyInspectionReport = (reportId: string) => {
    const targetReport = inspectionReports.find((r) => r.id === reportId);
    setInspectionReports((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, verificationStatus: 'Fully Verified' } : r
      )
    );

    if (backendConnected && targetReport) {
      const matchingMilestone = project.milestones.find(
        (m) =>
          m.id === targetReport.id ||
          m.name.toLowerCase() === targetReport.milestoneChecked.toLowerCase() ||
          targetReport.milestoneChecked.toLowerCase().includes(m.name.toLowerCase()) ||
          m.stage.toLowerCase() === targetReport.milestoneChecked.toLowerCase()
      );
      if (matchingMilestone) {
        api.verifyMilestone(matchingMilestone.id, `Verified based on inspection report ${targetReport.reportCode}`)
          .then(() => {
            showToast('Inspection report verified on server. Milestone sign-off synchronized.', 'success');
          })
          .catch((err) => {
            console.warn('[WENSURE API] Milestone verify failed:', err);
            showToast('Server update failed. Verification status retained in local sandbox.', 'warning');
          });
      } else {
        showToast('Inspection report updated in local record.', 'info');
      }
    } else {
      showToast('[Demo Mode] Inspection report marked verified in local sandbox record.', 'info');
    }
  };

  const approveBudgetTranche = (txId: string) => {
    setProject((prev) => {
      const updatedTx = prev.budgetTransactions.map((tx) => {
        if (tx.id === txId) {
          const amount = tx.contractorClaimedAmount;
          return {
            ...tx,
            independentlyVerifiedAmount: amount,
            customerPaidAmount: amount,
            status: 'Verified & Disbursed' as const,
          };
        }
        return tx;
      });

      const totalSpent = updatedTx.reduce((acc, t) => acc + t.customerPaidAmount, 0);

      return {
        ...prev,
        budgetTransactions: updatedTx,
        recordedExpenditure: totalSpent,
      };
    });

    if (backendConnected) {
      api.verifyAndDisburseTranche(txId)
        .then(() => {
          showToast('Tranche disbursed and recorded on server.', 'success');
        })
        .catch(() => {
          showToast('Tranche updated locally. Server disbursement synchronization failed.', 'warning');
        });
    } else {
      showToast('[Demo Mode] Tranche updated in local sandbox record. Real escrow release requires bank escrow integration and certified independent engineer inspection.', 'info');
    }
  };

  const resolveObservationAdmin = (issueId: string) => {
    setProject((prev) => {
      const updatedObs = prev.observations.map((obs) => {
        if (obs.id === issueId) {
          return { ...obs, status: 'Resolved' as const };
        }
        return obs;
      });
      const openCount = updatedObs.filter((o) => o.status !== 'Resolved').length;
      return {
        ...prev,
        observations: updatedObs,
        openObservationsCount: openCount,
      };
    });

    if (backendConnected) {
      api.resolveFinding(issueId)
        .then(() => {
          showToast('Observation closed and marked as verified resolved on server.', 'success');
        })
        .catch(() => {
          showToast('Server sync failed. Observation marked resolved in local sandbox.', 'warning');
        });
    } else {
      showToast('[Demo Mode] Observation closed in local sandbox record.', 'info');
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setRole: setCurrentRole,
        currentUser,
        project,
        contractors,
        opportunities,
        notifications,
        inspectionReports,
        activeFloor,
        setActiveFloor,
        toasts,
        showToast,
        removeToast,
        submitWorkUpdate,
        submitObservationResponse,
        expressOpportunityInterest,
        markNotificationRead,
        markAllNotificationsRead,
        verifyInspectionReport,
        approveBudgetTranche,
        resolveObservationAdmin,
        backendConnected,
        refreshProject,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.pool import StaticPool

from backend.app.main import app
from backend.app.database import Base, get_db
import backend.app.database as db_module
import backend.app.main as main_module
from backend.app.services.seed_service import seed_database_if_empty

# Create an isolated in-memory SQLite database specifically for test runs
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

test_engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = async_sessionmaker(
    bind=test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

async def override_get_db():
    async with TestingSessionLocal() as session:
        yield session

# Apply dependency override for isolated testing
app.dependency_overrides[get_db] = override_get_db
db_module.AsyncSessionLocal = TestingSessionLocal
db_module.engine = test_engine
main_module.AsyncSessionLocal = TestingSessionLocal
main_module.engine = test_engine

@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_database():
    """Initializes isolated test database schema and seeds test baseline data."""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with TestingSessionLocal() as session:
        await seed_database_if_empty(session)

    yield

    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await test_engine.dispose()

@pytest_asyncio.fixture
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac

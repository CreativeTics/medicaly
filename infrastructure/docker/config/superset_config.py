SECRET_KEY = 'Sup3rS3cr3tK3y'

SESSION_COOKIE_SAMESITE = "None"
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = False

WTF_CSRF_ENABLED = False


ENABLE_PROXY_FIX = True


# SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:pgp4ssw0rd@datawarehouse:5432/medicaly'

# SUPERSET_FEATURE_EMBEDDED_SUPERSET = True
# OVERRIDE_HTTP_HEADERS = {'X-Frame-Options': 'ALLOWALL'}
ENABLE_CORS = True
CORS_OPTIONS = {
    'supports_credentials': True,
    'allow_headers': ['*'],
    'resources': ['*'],
    'origins': ['*']
}

# SUPERSET_WEBSERVER_DOMAINS = ['http://localhost:5173', '*']


PUBLIC_ROLE_LIKE_GAMMA = True
# Dashboard embedding
FEATURE_FLAGS = {
    "EMBEDDED_SUPERSET": True
}
GUEST_ROLE_NAME = "Gamma"
GUEST_TOKEN_JWT_SECRET = "test-guest-secret-change-me"
GUEST_TOKEN_JWT_ALGO = "HS256"
GUEST_TOKEN_HEADER_NAME = "X-GuestToken"
GUEST_TOKEN_JWT_EXP_SECONDS = 1500  # 25 minutes

#  add support for multiple languages
LANGUAGES = {
    'en': {'flag': 'us', 'name': 'English'},
    "es": {"flag": "es", "name": "Spanish"},
}

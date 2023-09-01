SECRET_KEY = 'Sup3rS3cr3tK3y'

SESSION_COOKIE_SAMESITE = None
ENABLE_PROXY_FIX = True
PUBLIC_ROLE_LIKE_GAMMA = True
FEATURE_FLAGS = {
    "EMBEDDED_SUPERSET": True
}

# SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:pgp4ssw0rd@datawarehouse:5432/medicaly'

CORS_OPTIONS = {
    'supports_credentials': True,
    'allow_headers': ['*'],
    'resources': ['*'],
    'origins': ['*']
}

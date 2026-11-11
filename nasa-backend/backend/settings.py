from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

# Optionally load environment variables from .env if present
env_file = BASE_DIR / '.env'
if not env_file.exists():
    env_file = BASE_DIR.parent / '.env'
if env_file.exists():
    try:
        with open(env_file) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, val = line.split('=', 1)
                    key = key.strip()
                    val = val.strip().strip("'\"")
                    if key not in os.environ:
                        os.environ[key] = val
    except Exception:
        pass

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-nasa-hackathon-key-change-in-production')
DEBUG = os.environ.get('DEBUG', 'True').lower() in ('true', '1', 'yes')
ALLOWED_HOSTS = ['*'] if DEBUG else [
    h.strip() for h in os.environ.get('DJANGO_ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',') if h.strip()
]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# Database - Using SQLite for now, we'll switch to PostgreSQL later
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 100,
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS settings - allows frontend to access API
CORS_ALLOW_ALL_ORIGINS = True

# NASA API settings
NASA_API_KEY = os.environ.get('NASA_API_KEY', 'DEMO_KEY')
NASA_BASE_URL = os.environ.get('NASA_BASE_URL', 'https://api.nasa.gov')

# OpenAI API settings (optional for image analysis)
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', '')

# File storage for images and tiles
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
TILES_ROOT = os.path.join(BASE_DIR, 'tiles')

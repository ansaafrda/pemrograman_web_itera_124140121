import os

from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))
with open(os.path.join(here, 'README.md'), encoding='utf-8') as f:
    README = f.read()

requires = [
    'plaster_pastedeploy',
    'pyramid',
    'pyramid_jinja2',
    'pyramid_debugtoolbar',
    'waitress',
    'alembic',
    'pyramid_tm',
    'SQLAlchemy>=2.0.31',
    'zope.sqlalchemy',
    'psycopg2-binary',
    'python-dotenv',
    'marshmallow>=3.19,<4.0',
]

tests_require = [
    'WebTest',
    'pytest',
]

setup(
    name='library_api',
    version='0.0',
    description='LibraryAPI: REST API perpustakaan, Author dan Book (Praktikum PAW Pertemuan 7)',
    long_description=README,
    long_description_content_type='text/markdown',
    classifiers=[
        'Programming Language :: Python',
        'Framework :: Pyramid',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Internet :: WWW/HTTP :: WSGI :: Application',
    ],
    author='Annisa Afrida',
    url='',
    keywords='web pyramid pylons',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    extras_require={
        'testing': tests_require,
    },
    install_requires=requires,
    entry_points={
        'paste.app_factory': [
            'main = library_api:main',
        ],
        'console_scripts': [
            'initialize_library_api_db = library_api.scripts.initialize_db:main',
        ],
    },
)

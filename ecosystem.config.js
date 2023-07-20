module.exports = {
  apps: [
    {
      name: 'prodata-smartpd',
      script: 'node dist/src/main',
      env: {
        NODE_ENV: 'production',
        DATABASE_URL:
          'postgresql://postgres:dv@_7469@localhost:5432/smartpd?schema=public',
      },
    },
  ],
};

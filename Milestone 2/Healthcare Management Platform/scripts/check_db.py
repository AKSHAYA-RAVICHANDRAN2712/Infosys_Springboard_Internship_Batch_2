from shared_db import check_connection
print('Database connection:', 'OK' if check_connection() else 'FAILED')

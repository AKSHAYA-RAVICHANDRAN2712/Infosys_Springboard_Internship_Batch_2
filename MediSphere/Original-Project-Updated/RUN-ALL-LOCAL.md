# MediSphere local run

## Database
All Java `application.properties` files use the same Render PostgreSQL database with PostgreSQL/JPA configuration. Milestone 2 Python services use the root `.env` in the Milestone 2 Healthcare Management Platform folder.

## Start everything
Double-click `RUN-MEDISPHERE.bat` in this folder. It launches the 12 backend components and the Unified Dashboard on port 5500.

## Important
The project contains database credentials because this local package was prepared for the requested local demonstration. Do not commit or publish this package to a public repository. Rotate the Render database password before using the repository outside this local demo.

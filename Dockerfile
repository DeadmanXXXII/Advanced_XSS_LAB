# Use PowerShell image
FROM mcr.microsoft.com/powershell
USER root

# Hex-encoded PowerShell payload
RUN pwsh -Command "iex ([Text.Encoding]::ASCII.GetString(([Convert]::FromHexString('77726974652D686F737420506F7765725368656C6C2054616B65204F76657220636F6E74726F6C'))))"

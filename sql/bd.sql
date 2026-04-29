IF DB_ID('IsmaelCargoDB') IS NULL
BEGIN
    CREATE DATABASE IsmaelCargoDB;
END
GO

USE IsmaelCargoDB;
GO


IF OBJECT_ID('dbo.Historial_Envio','U') IS NOT NULL DROP TABLE dbo.Historial_Envio;
IF OBJECT_ID('dbo.Envio','U')           IS NOT NULL DROP TABLE dbo.Envio;
IF OBJECT_ID('dbo.Cliente','U')         IS NOT NULL DROP TABLE dbo.Cliente;
IF OBJECT_ID('dbo.Usuario','U')         IS NOT NULL DROP TABLE dbo.Usuario;
IF OBJECT_ID('dbo.Rol','U')             IS NOT NULL DROP TABLE dbo.Rol;
IF OBJECT_ID('dbo.EstadoEnvio','U')     IS NOT NULL DROP TABLE dbo.EstadoEnvio;
IF OBJECT_ID('dbo.TipoCarga','U')       IS NOT NULL DROP TABLE dbo.TipoCarga;
IF OBJECT_ID('dbo.Ciudad','U')          IS NOT NULL DROP TABLE dbo.Ciudad;
GO

-- ---------------------------------------------------------------------------
-- Catálogos
-- ---------------------------------------------------------------------------
CREATE TABLE dbo.Rol (
    id_rol  INT IDENTITY(1,1) PRIMARY KEY,
    nombre  VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE dbo.Ciudad (
    id_ciudad     INT IDENTITY(1,1) PRIMARY KEY,
    nombre        VARCHAR(100) NOT NULL,
    departamento  VARCHAR(100) NOT NULL
);

CREATE TABLE dbo.TipoCarga (
    id_tipo_carga INT IDENTITY(1,1) PRIMARY KEY,
    nombre        VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE dbo.EstadoEnvio (
    id_estado INT PRIMARY KEY,
    nombre    VARCHAR(50) NOT NULL,
    color     VARCHAR(30) NOT NULL,
    icon      VARCHAR(50) NOT NULL,
    orden     INT NOT NULL
);

-- ---------------------------------------------------------------------------
-- Usuarios y clientes
-- ---------------------------------------------------------------------------
CREATE TABLE dbo.Usuario (
    id_usuario       INT IDENTITY(1,1) PRIMARY KEY,
    usuario          VARCHAR(50) NOT NULL UNIQUE,
    password_hash    VARCHAR(255) NOT NULL,
    nombre_completo  VARCHAR(150) NOT NULL,
    email            VARCHAR(150) NULL,
    id_rol           INT NOT NULL,
    estado           BIT NOT NULL DEFAULT 1,
    fecha_creacion   DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Usuario_Rol FOREIGN KEY (id_rol) REFERENCES dbo.Rol(id_rol)
);

CREATE TABLE dbo.Cliente (
    id_cliente      INT IDENTITY(1,1) PRIMARY KEY,
    nombre          VARCHAR(150) NOT NULL,
    documento       VARCHAR(20) NULL,
    telefono        VARCHAR(20) NULL,
    email           VARCHAR(150) NULL,
    tipo            VARCHAR(20) NOT NULL DEFAULT 'ambos',
    fecha_registro  DATETIME NOT NULL DEFAULT GETDATE()
);

-- ---------------------------------------------------------------------------
-- Envíos e historial
-- ---------------------------------------------------------------------------
CREATE TABLE dbo.Envio (
    id_envio             INT IDENTITY(1,1) PRIMARY KEY,
    codigo               VARCHAR(20) NOT NULL UNIQUE,
    id_remitente         INT NOT NULL,
    id_destinatario      INT NOT NULL,
    id_origen            INT NOT NULL,
    id_destino           INT NOT NULL,
    id_tipo_carga        INT NOT NULL,
    peso_kg              DECIMAL(10,2) NOT NULL,
    descripcion          VARCHAR(500) NULL,
    id_estado_actual     INT NOT NULL,
    id_usuario_registro  INT NOT NULL,
    fecha_registro       DATETIME NOT NULL DEFAULT GETDATE(),
    fecha_actualizacion  DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Envio_Remitente    FOREIGN KEY (id_remitente)        REFERENCES dbo.Cliente(id_cliente),
    CONSTRAINT FK_Envio_Destinatario FOREIGN KEY (id_destinatario)     REFERENCES dbo.Cliente(id_cliente),
    CONSTRAINT FK_Envio_Origen       FOREIGN KEY (id_origen)           REFERENCES dbo.Ciudad(id_ciudad),
    CONSTRAINT FK_Envio_Destino      FOREIGN KEY (id_destino)          REFERENCES dbo.Ciudad(id_ciudad),
    CONSTRAINT FK_Envio_TipoCarga    FOREIGN KEY (id_tipo_carga)       REFERENCES dbo.TipoCarga(id_tipo_carga),
    CONSTRAINT FK_Envio_Estado       FOREIGN KEY (id_estado_actual)    REFERENCES dbo.EstadoEnvio(id_estado),
    CONSTRAINT FK_Envio_Usuario      FOREIGN KEY (id_usuario_registro) REFERENCES dbo.Usuario(id_usuario)
);

CREATE TABLE dbo.Historial_Envio (
    id_historial INT IDENTITY(1,1) PRIMARY KEY,
    id_envio     INT NOT NULL,
    id_estado    INT NOT NULL,
    observacion  VARCHAR(500) NULL,
    id_usuario   INT NOT NULL,
    fecha        DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Hist_Envio   FOREIGN KEY (id_envio)   REFERENCES dbo.Envio(id_envio) ON DELETE CASCADE,
    CONSTRAINT FK_Hist_Estado  FOREIGN KEY (id_estado)  REFERENCES dbo.EstadoEnvio(id_estado),
    CONSTRAINT FK_Hist_Usuario FOREIGN KEY (id_usuario) REFERENCES dbo.Usuario(id_usuario)
);

CREATE INDEX IX_Envio_Codigo ON dbo.Envio(codigo);
CREATE INDEX IX_Envio_Estado ON dbo.Envio(id_estado_actual);
CREATE INDEX IX_Hist_Envio   ON dbo.Historial_Envio(id_envio);
GO

-- ---------------------------------------------------------------------------
-- Catálogos: datos iniciales
-- ---------------------------------------------------------------------------
INSERT INTO dbo.Rol (nombre) VALUES ('admin'), ('operador');

INSERT INTO dbo.Ciudad (nombre, departamento) VALUES
    ('Lima',     'Lima'),
    ('Arequipa', 'Arequipa'),
    ('Cusco',    'Cusco'),
    ('Huancayo', 'Junin'),
    ('Trujillo', 'La Libertad'),
    ('Chiclayo', 'Lambayeque'),
    ('Piura',    'Piura'),
    ('Puno',     'Puno'),
    ('Ica',      'Ica'),
    ('Ayacucho', 'Ayacucho');

INSERT INTO dbo.TipoCarga (nombre) VALUES
    ('Carga general'),
    ('Carga fragil'),
    ('Carga refrigerada'),
    ('Carga peligrosa'),
    ('Documentos');

INSERT INTO dbo.EstadoEnvio (id_estado, nombre, color, icon, orden) VALUES
    (1, 'Pendiente',   'grey',     'schedule',        1),
    (2, 'En transito', 'info',     'local_shipping',  2),
    (3, 'En reparto',  'warning',  'delivery_dining', 3),
    (4, 'Entregado',   'positive', 'check_circle',    4);
GO

PRINT 'Esquema y catalogos creados correctamente.';
GO

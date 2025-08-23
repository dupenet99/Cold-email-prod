-- Creating comprehensive MSSQL table for storing all cold email system form data
CREATE TABLE ColdEmailSystem (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CompanyEmail NVARCHAR(255) NOT NULL,
    CompanyName NVARCHAR(255) NOT NULL,
    CompanyDescription NTEXT NOT NULL,
    CompanyLinks NTEXT NULL,
    SalesPitch NTEXT NOT NULL,
    ClientAvatar NTEXT NOT NULL,
    LeadListOption NVARCHAR(50) NOT NULL CHECK (LeadListOption IN ('build', 'have')),
    EmailName NVARCHAR(100) NOT NULL,
    
    -- Sending days as individual boolean columns
    SendingMonday BIT NOT NULL DEFAULT 0,
    SendingTuesday BIT NOT NULL DEFAULT 0,
    SendingWednesday BIT NOT NULL DEFAULT 0,
    SendingThursday BIT NOT NULL DEFAULT 0,
    SendingFriday BIT NOT NULL DEFAULT 0,
    SendingSaturday BIT NOT NULL DEFAULT 0,
    SendingSunday BIT NOT NULL DEFAULT 0,
    
    SendingTimeFrom TIME NOT NULL,
    SendingTimeTo TIME NOT NULL,
    LeadRedirection NVARCHAR(500) NOT NULL,
    Agreement BIT NOT NULL DEFAULT 0,
    
    -- System fields
    Status NVARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (Status IN ('Pending', 'In Progress', 'Completed', 'Cancelled')),
    CreatedDate DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedDate DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    -- Indexes for better performance
    INDEX IX_ColdEmailSystem_CompanyEmail (CompanyEmail),
    INDEX IX_ColdEmailSystem_Status (Status),
    INDEX IX_ColdEmailSystem_CreatedDate (CreatedDate)
);

-- Adding trigger to automatically update UpdatedDate on record changes
CREATE TRIGGER TR_ColdEmailSystem_UpdatedDate
ON ColdEmailSystem
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE ColdEmailSystem 
    SET UpdatedDate = GETDATE()
    FROM ColdEmailSystem c
    INNER JOIN inserted i ON c.Id = i.Id;
END;

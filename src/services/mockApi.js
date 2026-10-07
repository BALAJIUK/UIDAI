// Fictional mock credentials. No real Aadhaar or personal data.
export const MOCK_CREDENTIALS = [
  {
    id: 'cred-001',
    name: 'Mock Identity Credential',
    type: 'Identity',
    issuer: 'UIDAI Sandbox',
    status: 'Active',
    issuedAt: '2026-01-15',
    identifier: '123456789012',
  },
  {
    id: 'cred-002',
    name: 'Mock Address Credential',
    type: 'Address',
    issuer: 'UIDAI Sandbox',
    status: 'Active',
    issuedAt: '2025-11-02',
    identifier: '987654321098',
  },
  {
    id: 'cred-003',
    name: 'Mock Verification Credential',
    type: 'Verification',
    issuer: 'Demo Trust Services',
    status: 'Expired',
    issuedAt: '2024-06-20',
    identifier: '555012345678',
  },
]

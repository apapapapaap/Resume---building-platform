import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Plus, Trash2 } from 'lucide-react';

const CertificationsForm = ({ data, updateData }) => {
  const addCertification = () => {
    const newCertification = {
      id: Date.now(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: '',
      url: ''
    };
    
    updateData('certifications', [...data.certifications, newCertification]);
  };

  const removeCertification = (id) => {
    updateData('certifications', data.certifications.filter(cert => cert.id !== id));
  };

  const updateCertification = (id, field, value) => {
    updateData('certifications', data.certifications.map(cert =>
      cert.id === id ? { ...cert, [field]: value } : cert
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Certifications</h3>
        <Button onClick={addCertification} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Certification
        </Button>
      </div>

      {data.certifications.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No certifications added yet.</p>
          <Button onClick={addCertification} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Certification
          </Button>
        </div>
      )}

      {data.certifications.map((cert, index) => (
        <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Certification #{index + 1}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeCertification(cert.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certification Name *
                </label>
                <Input
                  value={cert.name}
                  onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                  placeholder="AWS Solutions Architect"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issuing Organization *
                </label>
                <Input
                  value={cert.issuer}
                  onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                  placeholder="Amazon Web Services"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Date
                </label>
                <Input
                  type="month"
                  value={cert.date}
                  onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date (Optional)
                </label>
                <Input
                  type="month"
                  value={cert.expiryDate}
                  onChange={(e) => updateCertification(cert.id, 'expiryDate', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credential ID
                </label>
                <Input
                  value={cert.credentialId}
                  onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                  placeholder="ABC123XYZ"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification URL
                </label>
                <Input
                  value={cert.url}
                  onChange={(e) => updateCertification(cert.id, 'url', e.target.value)}
                  placeholder="https://verify-certificate.com"
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium text-green-900 mb-2">Tips for certifications:</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Include only relevant, recent certifications</li>
          <li>• Add verification URLs when available</li>
          <li>• Mention expiry dates for time-sensitive certifications</li>
          <li>• Prioritize industry-recognized certifications</li>
        </ul>
      </div>
    </div>
  );
};

export default CertificationsForm;

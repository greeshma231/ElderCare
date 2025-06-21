import React, { useState, useRef } from 'react';
import { 
  Users, 
  Phone, 
  MessageCircle, 
  Plus, 
  Search, 
  Filter,
  Star,
  StarOff,
  Edit3,
  Trash2,
  X,
  Check,
  AlertTriangle,
  Heart,
  UserCheck,
  Stethoscope,
  Home,
  Mail,
  Clock,
  MapPin,
  Shield
} from 'lucide-react';

interface Caregiver {
  id: string;
  name: string;
  relation: string;
  phone: string;
  email?: string;
  notes?: string;
  avatar?: string;
  isPrimary: boolean;
  isEmergencyContact: boolean;
  category: 'family' | 'medical' | 'professional' | 'friend';
  lastContact?: Date;
  address?: string;
  specialty?: string;
}

interface AddCaregiverFormData {
  name: string;
  relation: string;
  phone: string;
  email: string;
  notes: string;
  category: 'family' | 'medical' | 'professional' | 'friend';
  isPrimary: boolean;
  isEmergencyContact: boolean;
  address: string;
  specialty: string;
}

const relationOptions = {
  family: ['Daughter', 'Son', 'Spouse', 'Sister', 'Brother', 'Grandchild', 'Niece', 'Nephew', 'Other Family'],
  medical: ['Primary Doctor', 'Cardiologist', 'Neurologist', 'Pharmacist', 'Nurse', 'Therapist', 'Specialist'],
  professional: ['Home Care Aide', 'Housekeeper', 'Driver', 'Companion', 'Social Worker', 'Case Manager'],
  friend: ['Close Friend', 'Neighbor', 'Church Member', 'Community Friend', 'Volunteer']
};

const categoryIcons = {
  family: Heart,
  medical: Stethoscope,
  professional: UserCheck,
  friend: Users
};

const categoryColors = {
  family: 'bg-pink-50 border-pink-200 text-pink-700',
  medical: 'bg-blue-50 border-blue-200 text-blue-700',
  professional: 'bg-green-50 border-green-200 text-green-700',
  friend: 'bg-purple-50 border-purple-200 text-purple-700'
};

export const Caregivers: React.FC = () => {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      relation: 'Daughter',
      phone: '(555) 123-4567',
      email: 'sarah.johnson@email.com',
      notes: 'Lives nearby, available for emergencies',
      isPrimary: true,
      isEmergencyContact: true,
      category: 'family',
      lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      address: '123 Oak Street, Same City'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      relation: 'Primary Doctor',
      phone: '(555) 987-6543',
      email: 'mchen@healthcenter.com',
      notes: 'Family medicine, 15+ years experience',
      isPrimary: false,
      isEmergencyContact: false,
      category: 'medical',
      lastContact: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      specialty: 'Family Medicine',
      address: 'Downtown Medical Center'
    },
    {
      id: '3',
      name: 'Maria Rodriguez',
      relation: 'Home Care Aide',
      phone: '(555) 456-7890',
      email: 'maria.r@careservices.com',
      notes: 'Comes Tuesdays and Fridays, very reliable',
      isPrimary: false,
      isEmergencyContact: false,
      category: 'professional',
      lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      address: 'Care Services Inc.'
    },
    {
      id: '4',
      name: 'Robert Thompson',
      relation: 'Son',
      phone: '(555) 234-5678',
      email: 'rob.thompson@email.com',
      notes: 'Lives out of state, calls weekly',
      isPrimary: false,
      isEmergencyContact: true,
      category: 'family',
      lastContact: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      address: 'Portland, Oregon'
    },
    {
      id: '5',
      name: 'Betty Williams',
      relation: 'Neighbor',
      phone: '(555) 345-6789',
      notes: 'Next door neighbor, has spare key',
      isPrimary: false,
      isEmergencyContact: false,
      category: 'friend',
      lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      address: '125 Oak Street (Next Door)'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'family' | 'medical' | 'professional' | 'friend'>('all');
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false);
  
  const [formData, setFormData] = useState<AddCaregiverFormData>({
    name: '',
    relation: '',
    phone: '',
    email: '',
    notes: '',
    category: 'family',
    isPrimary: false,
    isEmergencyContact: false,
    address: '',
    specialty: ''
  });

  const handleAddCaregiver = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      return;
    }

    // If setting as primary, remove primary from others
    if (formData.isPrimary) {
      setCaregivers(prev => prev.map(c => ({ ...c, isPrimary: false })));
    }

    const newCaregiver: Caregiver = {
      id: Date.now().toString(),
      name: formData.name,
      relation: formData.relation || 'Contact',
      phone: formData.phone,
      email: formData.email || undefined,
      notes: formData.notes || undefined,
      isPrimary: formData.isPrimary,
      isEmergencyContact: formData.isEmergencyContact,
      category: formData.category,
      address: formData.address || undefined,
      specialty: formData.specialty || undefined
    };

    setCaregivers(prev => [...prev, newCaregiver]);
    resetForm();
    setShowAddForm(false);
  };

  const handleEditCaregiver = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !showEditForm) {
      return;
    }

    // If setting as primary, remove primary from others
    if (formData.isPrimary) {
      setCaregivers(prev => prev.map(c => ({ ...c, isPrimary: c.id === showEditForm ? true : false })));
    }

    setCaregivers(prev => prev.map(caregiver => 
      caregiver.id === showEditForm 
        ? {
            ...caregiver,
            name: formData.name,
            relation: formData.relation || 'Contact',
            phone: formData.phone,
            email: formData.email || undefined,
            notes: formData.notes || undefined,
            isPrimary: formData.isPrimary,
            isEmergencyContact: formData.isEmergencyContact,
            category: formData.category,
            address: formData.address || undefined,
            specialty: formData.specialty || undefined
          }
        : caregiver
    ));

    resetForm();
    setShowEditForm(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      relation: '',
      phone: '',
      email: '',
      notes: '',
      category: 'family',
      isPrimary: false,
      isEmergencyContact: false,
      address: '',
      specialty: ''
    });
  };

  const startEdit = (caregiver: Caregiver) => {
    setFormData({
      name: caregiver.name,
      relation: caregiver.relation,
      phone: caregiver.phone,
      email: caregiver.email || '',
      notes: caregiver.notes || '',
      category: caregiver.category,
      isPrimary: caregiver.isPrimary,
      isEmergencyContact: caregiver.isEmergencyContact,
      address: caregiver.address || '',
      specialty: caregiver.specialty || ''
    });
    setShowEditForm(caregiver.id);
  };

  const confirmDelete = (id: string) => {
    setCaregivers(prev => prev.filter(c => c.id !== id));
    setShowDeleteModal(null);
  };

  const togglePrimary = (id: string) => {
    setCaregivers(prev => prev.map(caregiver => ({
      ...caregiver,
      isPrimary: caregiver.id === id ? !caregiver.isPrimary : false
    })));
  };

  const toggleEmergencyContact = (id: string) => {
    setCaregivers(prev => prev.map(caregiver => 
      caregiver.id === id 
        ? { ...caregiver, isEmergencyContact: !caregiver.isEmergencyContact }
        : caregiver
    ));
  };

  const handleCall = (phone: string, name: string) => {
    // In a real implementation, this would initiate a call
    console.log(`Calling ${name} at ${phone}`);
    alert(`Calling ${name}...`);
  };

  const handleMessage = (phone: string, name: string) => {
    // In a real implementation, this would open messaging app
    console.log(`Messaging ${name} at ${phone}`);
    alert(`Opening message to ${name}...`);
  };

  const formatLastContact = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const filteredCaregivers = caregivers.filter(caregiver => {
    const matchesSearch = caregiver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         caregiver.relation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         caregiver.phone.includes(searchQuery);
    
    const matchesCategory = filterCategory === 'all' || caregiver.category === filterCategory;
    const matchesEmergency = !showEmergencyOnly || caregiver.isEmergencyContact;
    
    return matchesSearch && matchesCategory && matchesEmergency;
  });

  const primaryContact = caregivers.find(c => c.isPrimary);
  const emergencyContacts = caregivers.filter(c => c.isEmergencyContact);

  return (
    <main className="flex-1 ml-70 p-6 bg-eldercare-background" role="main" aria-label="Your Care Team">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-nunito font-bold text-eldercare-secondary mb-2">
                Your Care Team
              </h1>
              <p className="text-lg font-opensans text-eldercare-text">
                Stay connected with your trusted caregivers
              </p>
            </div>
            
            {/* Add Caregiver Button */}
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-eldercare-primary hover:bg-eldercare-primary-dark text-white rounded-xl font-opensans font-semibold text-base min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2 hover:scale-105 shadow-md"
            >
              <Plus size={20} aria-hidden="true" />
              <span>Add Caregiver</span>
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-eldercare-text-light" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or relation"
                className="w-full pl-10 pr-4 py-3 text-base font-opensans border-2 border-eldercare-primary/20 rounded-xl focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200 bg-white"
                aria-label="Search caregivers"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Filter size={16} className="text-eldercare-text-light" aria-hidden="true" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as any)}
                  className="px-3 py-2 text-base font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200 bg-white"
                  aria-label="Filter by category"
                >
                  <option value="all">All Categories</option>
                  <option value="family">Family</option>
                  <option value="medical">Medical</option>
                  <option value="professional">Professional</option>
                  <option value="friend">Friends</option>
                </select>
              </div>

              {/* Emergency Only Toggle */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="emergency-only"
                  checked={showEmergencyOnly}
                  onChange={(e) => setShowEmergencyOnly(e.target.checked)}
                  className="w-4 h-4 text-eldercare-primary bg-white border-2 border-eldercare-primary/30 rounded focus:ring-eldercare-primary focus:ring-2"
                />
                <label htmlFor="emergency-only" className="text-sm font-opensans text-eldercare-secondary">
                  Emergency Only
                </label>
              </div>
            </div>
          </div>
        </header>

        {/* Emergency Contact Info Section */}
        {primaryContact && (
          <section className="mb-8 bg-red-50 border-2 border-red-200 rounded-xl p-6" aria-labelledby="emergency-section">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield size={24} className="text-red-600" aria-hidden="true" />
              </div>
              <h2 id="emergency-section" className="text-xl font-nunito font-bold text-red-700">
                Primary Emergency Contact
              </h2>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-red-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-nunito font-bold text-red-700">
                      {getInitials(primaryContact.name)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-nunito font-bold text-eldercare-secondary">
                      {primaryContact.name}
                    </h3>
                    <p className="text-base font-opensans text-eldercare-text">
                      {primaryContact.relation} • {primaryContact.phone}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCall(primaryContact.phone, primaryContact.name)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-opensans font-medium text-sm transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-red-500 focus:ring-offset-2"
                    aria-label={`Call ${primaryContact.name}`}
                  >
                    <Phone size={16} aria-hidden="true" />
                    <span>Emergency Call</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Caregivers Grid */}
        <section aria-labelledby="caregivers-grid">
          <h2 id="caregivers-grid" className="sr-only">Caregivers List</h2>
          
          {filteredCaregivers.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md border border-eldercare-primary/10 p-12 text-center">
              <Users size={64} className="text-eldercare-primary mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-2xl font-nunito font-bold text-eldercare-secondary mb-2">
                {searchQuery || filterCategory !== 'all' || showEmergencyOnly 
                  ? 'No caregivers found' 
                  : 'No caregivers added yet'
                }
              </h3>
              <p className="text-base font-opensans text-eldercare-text mb-6">
                {searchQuery || filterCategory !== 'all' || showEmergencyOnly
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start building your care team by adding your first caregiver'
                }
              </p>
              {!searchQuery && filterCategory === 'all' && !showEmergencyOnly && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-6 py-3 bg-eldercare-primary hover:bg-eldercare-primary-dark text-white rounded-lg font-opensans font-semibold text-base transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2"
                >
                  Add Your First Caregiver
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCaregivers.map((caregiver) => {
                const CategoryIcon = categoryIcons[caregiver.category];
                
                return (
                  <div
                    key={caregiver.id}
                    className="bg-white rounded-xl shadow-md border-2 border-eldercare-primary/10 p-6 hover:shadow-lg hover:border-eldercare-primary/30 transition-all duration-300 hover:scale-[1.02]"
                    role="article"
                    aria-labelledby={`caregiver-${caregiver.id}-name`}
                  >
                    {/* Header with Avatar and Primary/Emergency Badges */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <div className="w-16 h-16 bg-eldercare-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xl font-nunito font-bold text-eldercare-primary">
                              {getInitials(caregiver.name)}
                            </span>
                          </div>
                          {caregiver.isPrimary && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                              <Star size={12} className="text-white" aria-hidden="true" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 
                            id={`caregiver-${caregiver.id}-name`}
                            className="text-xl font-nunito font-bold text-eldercare-secondary mb-1"
                          >
                            {caregiver.name}
                          </h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <CategoryIcon size={16} className="text-eldercare-primary" aria-hidden="true" />
                            <span className="text-base font-opensans text-eldercare-text">
                              {caregiver.relation}
                            </span>
                          </div>
                          
                          {/* Badges */}
                          <div className="flex flex-wrap gap-2 mb-2">
                            {caregiver.isPrimary && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-opensans font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                <Star size={10} className="mr-1" aria-hidden="true" />
                                Primary Contact
                              </span>
                            )}
                            {caregiver.isEmergencyContact && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-opensans font-medium bg-red-100 text-red-800 border border-red-200">
                                <AlertTriangle size={10} className="mr-1" aria-hidden="true" />
                                Emergency
                              </span>
                            )}
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-opensans font-medium border ${categoryColors[caregiver.category]}`}>
                              {caregiver.category.charAt(0).toUpperCase() + caregiver.category.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Edit/Delete Actions */}
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => startEdit(caregiver)}
                          className="p-2 text-eldercare-primary hover:text-eldercare-primary-dark hover:bg-eldercare-primary/10 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-eldercare-primary focus:ring-offset-1"
                          aria-label={`Edit ${caregiver.name}`}
                          title="Edit caregiver"
                        >
                          <Edit3 size={16} aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(caregiver.id)}
                          className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                          aria-label={`Delete ${caregiver.name}`}
                          title="Delete caregiver"
                        >
                          <Trash2 size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2">
                        <Phone size={14} className="text-eldercare-text-light" aria-hidden="true" />
                        <span className="text-base font-opensans text-eldercare-secondary font-medium">
                          {caregiver.phone}
                        </span>
                      </div>
                      
                      {caregiver.email && (
                        <div className="flex items-center space-x-2">
                          <Mail size={14} className="text-eldercare-text-light" aria-hidden="true" />
                          <span className="text-sm font-opensans text-eldercare-text">
                            {caregiver.email}
                          </span>
                        </div>
                      )}
                      
                      {caregiver.address && (
                        <div className="flex items-center space-x-2">
                          <MapPin size={14} className="text-eldercare-text-light" aria-hidden="true" />
                          <span className="text-sm font-opensans text-eldercare-text">
                            {caregiver.address}
                          </span>
                        </div>
                      )}
                      
                      {caregiver.specialty && (
                        <div className="flex items-center space-x-2">
                          <Stethoscope size={14} className="text-eldercare-text-light" aria-hidden="true" />
                          <span className="text-sm font-opensans text-eldercare-text">
                            {caregiver.specialty}
                          </span>
                        </div>
                      )}
                      
                      {caregiver.lastContact && (
                        <div className="flex items-center space-x-2">
                          <Clock size={14} className="text-eldercare-text-light" aria-hidden="true" />
                          <span className="text-sm font-opensans text-eldercare-text-light">
                            Last contact: {formatLastContact(caregiver.lastContact)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    {caregiver.notes && (
                      <div className="mb-4 p-3 bg-eldercare-background/30 rounded-lg">
                        <p className="text-sm font-opensans text-eldercare-text italic">
                          {caregiver.notes}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-eldercare-primary/10">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleCall(caregiver.phone, caregiver.name)}
                          className="flex items-center space-x-2 px-4 py-2 bg-eldercare-primary hover:bg-eldercare-primary-dark text-white rounded-lg font-opensans font-medium text-sm min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2"
                          aria-label={`Call ${caregiver.name}`}
                        >
                          <Phone size={16} aria-hidden="true" />
                          <span>Call</span>
                        </button>
                        
                        <button
                          onClick={() => handleMessage(caregiver.phone, caregiver.name)}
                          className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-eldercare-primary text-eldercare-primary hover:bg-eldercare-primary hover:text-white rounded-lg font-opensans font-medium text-sm min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2"
                          aria-label={`Message ${caregiver.name}`}
                        >
                          <MessageCircle size={16} aria-hidden="true" />
                          <span>Message</span>
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => togglePrimary(caregiver.id)}
                          className={`p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                            caregiver.isPrimary
                              ? 'text-yellow-600 hover:text-yellow-700 focus:ring-yellow-500'
                              : 'text-gray-400 hover:text-yellow-500 focus:ring-yellow-500'
                          }`}
                          aria-label={caregiver.isPrimary ? 'Remove as primary contact' : 'Set as primary contact'}
                          title={caregiver.isPrimary ? 'Remove as primary' : 'Set as primary'}
                        >
                          {caregiver.isPrimary ? <Star size={18} /> : <StarOff size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Add/Edit Caregiver Modal */}
        {(showAddForm || showEditForm) && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="caregiver-modal-title"
          >
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 
                    id="caregiver-modal-title"
                    className="text-2xl font-nunito font-bold text-eldercare-secondary"
                  >
                    {showEditForm ? 'Edit Caregiver' : 'Add New Caregiver'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setShowEditForm(null);
                      resetForm();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-eldercare-primary focus:ring-offset-1"
                    aria-label="Close dialog"
                  >
                    <X size={24} className="text-eldercare-text" aria-hidden="true" />
                  </button>
                </div>

                <form onSubmit={showEditForm ? handleEditCaregiver : handleAddCaregiver} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label 
                        htmlFor="caregiver-name" 
                        className="block text-base font-opensans font-medium text-eldercare-secondary mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        id="caregiver-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 text-base font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200"
                        placeholder="e.g., Sarah Johnson"
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label 
                        htmlFor="caregiver-phone" 
                        className="block text-base font-opensans font-medium text-eldercare-secondary mb-2"
                      >
                        Phone Number *
                      </label>
                      <input
                        id="caregiver-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 text-base font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200"
                        placeholder="(555) 123-4567"
                        required
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label 
                        htmlFor="caregiver-category" 
                        className="block text-base font-opensans font-medium text-eldercare-secondary mb-2"
                      >
                        Category
                      </label>
                      <select
                        id="caregiver-category"
                        value={formData.category}
                        onChange={(e) => {
                          const category = e.target.value as any;
                          setFormData(prev => ({ 
                            ...prev, 
                            category,
                            relation: '' // Reset relation when category changes
                          }));
                        }}
                        className="w-full px-4 py-3 text-base font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200"
                      >
                        <option value="family">Family</option>
                        <option value="medical">Medical</option>
                        <option value="professional">Professional</option>
                        <option value="friend">Friend</option>
                      </select>
                    </div>

                    {/* Relation */}
                    <div>
                      <label 
                        htmlFor="caregiver-relation" 
                        className="block text-base font-opensans font-medium text-eldercare-secondary mb-2"
                      >
                        Relation/Role
                      </label>
                      <select
                        id="caregiver-relation"
                        value={formData.relation}
                        onChange={(e) => setFormData(prev => ({ ...prev, relation: e.target.value }))}
                        className="w-full px-4 py-3 text-base font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200"
                      >
                        <option value="">Select relation...</option>
                        {relationOptions[formData.category].map(relation => (
                          <option key={relation} value={relation}>{relation}</option>
                        ))}
                      </select>
                    </div>

                    {/* Email */}
                    <div>
                      <label 
                        htmlFor="caregiver-email" 
                        className="block text-base font-opensans font-medium text-eldercare-secondary mb-2"
                      >
                        Email (Optional)
                      </label>
                      <input
                        id="caregiver-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 text-base font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200"
                        placeholder="email@example.com"
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label 
                        htmlFor="caregiver-address" 
                        className="block text-base font-opensans font-medium text-eldercare-secondary mb-2"
                      >
                        Address (Optional)
                      </label>
                      <input
                        id="caregiver-address"
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full px-4 py-3 text-base font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200"
                        placeholder="123 Main Street, City"
                      />
                    </div>
                  </div>

                  {/* Specialty (for medical category) */}
                  {formData.category === 'medical' && (
                    <div>
                      <label 
                        htmlFor="caregiver-specialty" 
                        className="block text-base font-opensans font-medium text-eldercare-secondary mb-2"
                      >
                        Specialty (Optional)
                      </label>
                      <input
                        id="caregiver-specialty"
                        type="text"
                        value={formData.specialty}
                        onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                        className="w-full px-4 py-3 text-base font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200"
                        placeholder="e.g., Family Medicine, Cardiology"
                      />
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label 
                      htmlFor="caregiver-notes" 
                      className="block text-base font-opensans font-medium text-eldercare-secondary mb-2"
                    >
                      Notes (Optional)
                    </label>
                    <textarea
                      id="caregiver-notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 text-base font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200 resize-none"
                      placeholder="Any special notes or instructions..."
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="is-primary"
                        checked={formData.isPrimary}
                        onChange={(e) => setFormData(prev => ({ ...prev, isPrimary: e.target.checked }))}
                        className="w-5 h-5 text-eldercare-primary bg-white border-2 border-eldercare-primary/30 rounded focus:ring-eldercare-primary focus:ring-2"
                      />
                      <label htmlFor="is-primary" className="text-base font-opensans text-eldercare-secondary">
                        Set as Primary Contact
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="is-emergency"
                        checked={formData.isEmergencyContact}
                        onChange={(e) => setFormData(prev => ({ ...prev, isEmergencyContact: e.target.checked }))}
                        className="w-5 h-5 text-eldercare-primary bg-white border-2 border-eldercare-primary/30 rounded focus:ring-eldercare-primary focus:ring-2"
                      />
                      <label htmlFor="is-emergency" className="text-base font-opensans text-eldercare-secondary">
                        Emergency Contact
                      </label>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex space-x-4 pt-6 border-t border-eldercare-primary/10">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setShowEditForm(null);
                        resetForm();
                      }}
                      className="flex-1 px-6 py-3 border-2 border-eldercare-primary text-eldercare-primary rounded-lg font-opensans font-semibold text-base min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2 hover:bg-eldercare-primary/5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-eldercare-primary hover:bg-eldercare-primary-dark text-white rounded-lg font-opensans font-semibold text-base min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2"
                    >
                      {showEditForm ? 'Update Caregiver' : 'Add Caregiver'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
          >
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 
                id="delete-modal-title"
                className="text-xl font-nunito font-bold text-eldercare-secondary mb-4"
              >
                Remove Caregiver
              </h3>
              <p className="text-base font-opensans text-eldercare-text mb-6">
                Are you sure you want to remove this caregiver from your care team? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-eldercare-secondary rounded-lg font-opensans font-semibold text-base min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-gray-300 focus:ring-offset-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmDelete(showDeleteModal)}
                  className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-opensans font-semibold text-base min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-red-500 focus:ring-offset-2"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
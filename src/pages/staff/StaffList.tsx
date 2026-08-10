// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { fetchStaff, type StaffMember } from '../../services/staff.service';
import { Link } from 'react-router-dom';
import './Staff.css';

const StaffList: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStaff = async () => {
      const { data, error } = await fetchStaff('gym1');
      if (data) {
        setStaffList(data);
      }
      setLoading(false);
    };
    loadStaff();
  }, []);

  return (
    <div className="staff-page-container">
      <div className="staff-header">
        <h1>Staff Directory</h1>
        <Link to="/staff/add" className="btn-primary">+ Add Staff</Link>
      </div>

      {loading ? (
        <div className="loading-text">Loading staff members...</div>
      ) : (
        <div className="staff-grid">
          {staffList.map((staff) => (
            <div key={staff.id} className="staff-card">
              <h3>{staff.name}</h3>
              <div className="staff-role">{staff.role}</div>
              <div className="staff-contact">
                {staff.phone && (
                  <div className="staff-contact-item">
                    📞 {staff.phone}
                  </div>
                )}
                {staff.email && (
                  <div className="staff-contact-item">
                    ✉️ {staff.email}
                  </div>
                )}
              </div>
            </div>
          ))}
          {staffList.length === 0 && (
            <div style={{ color: '#a0a0a0' }}>No staff members found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default StaffList;



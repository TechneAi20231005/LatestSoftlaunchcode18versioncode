import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import classNames from 'classnames';
export default function TabComponent() {
  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: () => <i class="icofont-home me-2 fs-6" />
    },
    {
      id: 'requests',
      label: 'My Requests',
      icon: () => <i className="icofont-list me-2 fs-6" />
    },

    {
      id: 'team',
      label: 'Team',
      icon: () => <i className="icofont-group me-2 fs-6" />
    }
  ];

  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Card className="mb-4 shadow rounded-3 border-0 mt-3">
      <Card.Body className="p-3">
        <div className="d-flex overflow-x-auto gap-2">
          {tabs?.map((tab) => {
            const Icon = tab?.icon;
            const isActive = activeTab === tab?.id;

            return (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={classNames(
                  'btn d-flex align-items-center btn-sm rounded p-2',
                  isActive ? 'btn-primary shadow-sm' : 'btn-outline-secondary'
                )}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab?.label}
              </button>
            );
          })}
        </div>
      </Card.Body>
    </Card>
  );
}

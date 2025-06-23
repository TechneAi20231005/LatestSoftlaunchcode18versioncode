import React from 'react';
import { Card, Badge } from 'react-bootstrap';
// import {
//   Calendar,
//   Clock,
//   TrendingUp,
//   Users,
//   Award,
//   AlertTriangle,
//   CheckCircle2,
//   XCircle
// } from 'lucide-react';

const MetricsPanel = () => {
  const metrics = [
    {
      title: 'Full Days',
      value: '0',
      //   icon: Calendar,
      color: 'text-primary',
      bgColor: 'bg-primary bg-opacity-10',
      change: '+0%',
      changeType: 'neutral'
    },
    {
      title: 'Unpaid Leave',
      value: '0',
      //   icon: XCircle,
      color: 'text-danger',
      bgColor: 'bg-danger bg-opacity-10',
      change: '0%',
      changeType: 'neutral'
    },
    {
      title: 'Week Off Days',
      value: '2',
      //   icon: Calendar,
      color: 'text-secondary',
      bgColor: 'bg-secondary bg-opacity-10',
      change: 'Normal',
      changeType: 'neutral'
    },
    {
      title: 'Paid Leave',
      value: '0',
      //   icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success bg-opacity-10',
      change: '0%',
      changeType: 'neutral'
    },
    {
      title: 'Paid Half Day',
      value: '0',
      //   icon: Clock,
      color: 'text-info',
      bgColor: 'bg-info bg-opacity-10',
      change: '0%',
      changeType: 'neutral'
    },
    {
      title: 'Extra Working Day',
      value: '0',
      //   icon: TrendingUp,
      color: 'text-purple',
      bgColor: 'bg-light',
      change: '0%',
      changeType: 'neutral'
    },
    {
      title: 'Late Mark',
      value: '0',
      //   icon: AlertTriangle,
      color: 'text-warning',
      bgColor: 'bg-warning bg-opacity-10',
      change: 'Good',
      changeType: 'positive'
    },
    {
      title: 'Total Days',
      value: '2',
      //   icon: Award,
      color: 'text-indigo',
      bgColor: 'bg-light',
      change: 'June 2025',
      changeType: 'neutral'
    }
  ];

  const getBadgeClass = (type) => {
    switch (type) {
      case 'positive':
        return 'bg-success text-white';
      case 'negative':
        return 'bg-danger text-white';
      default:
        return 'bg-light text-secondary';
    }
  };

  return (
    <div className="row g-4">
      {metrics.map((metric, index) => {
        // const Icon = metric.icon;
        return (
          <div key={index} className="col-12 col-md-6 col-lg-3">
            <Card className="shadow rounded-3 border-0 h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="text mb-0">{metric.title}</h6>
                  <div className={`p-2 rounded ${metric.bgColor}`}>
                    {/* <Icon size={20} className={metric.color} /> */}
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className={`fw-bold ${metric.color} mb-0`}>
                    {metric.value}
                  </h4>
                  <Badge
                    className={`px-2 py-1 ${getBadgeClass(metric.changeType)}`}
                  >
                    {metric.change}
                  </Badge>
                </div>
              </Card.Body>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsPanel;

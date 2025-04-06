'use client';

import { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import './swagger-ui.css';

export default function ApiDocs() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="p-8">Loading API documentation...</div>;
  }

  return (
    <div className="swagger-container">
      <SwaggerUI url="/api/docs" />
      <style jsx global>{`
        .swagger-ui .topbar {
          display: none;
        }
        .swagger-container {
          margin: 0;
          padding: 0;
        }
        .swagger-ui {
          padding: 1rem;
        }
      `}</style>
    </div>
  );
}

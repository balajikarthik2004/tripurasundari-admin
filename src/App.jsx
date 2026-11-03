import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { DevoteeServicesProvider } from './context/DevoteeServicesContext';
import { TempleOperationsProvider } from './context/TempleOperationsContext';
import { ContentManagementProvider } from './context/ContentManagementContext';
import { InsightsAdminProvider } from './context/InsightsAdminContext';
import { TempleCalendarProvider } from './context/TempleCalendarContext';

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <DevoteeServicesProvider>
        <TempleOperationsProvider>
          <TempleCalendarProvider>
            <ContentManagementProvider>
              <InsightsAdminProvider>
                <AppRoutes />
              </InsightsAdminProvider>
            </ContentManagementProvider>
          </TempleCalendarProvider>
        </TempleOperationsProvider>
      </DevoteeServicesProvider>
    </BrowserRouter>
  );
}

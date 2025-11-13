import React from 'react';

interface TabsProps {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

interface TabsContentProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

export function Tabs({ children, defaultValue, value, onValueChange, className = '' }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultValue || '');
  
  const currentValue = value !== undefined ? value : activeTab;
  
  const handleTabChange = (newValue: string) => {
    if (value === undefined) {
      setActiveTab(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <div className={`w-full ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { 
            activeTab: currentValue, 
            onTabChange: handleTabChange 
          } as any);
        }
        return child;
      })}
    </div>
  );
}

export function TabsList({ children, className = '' }: TabsListProps) {
  return (
    <div className={`flex space-x-1 bg-gray-800 rounded-lg p-1 ${className}`}>
      {children}
    </div>
  );
}

export function TabsTrigger({ children, value, className = '', ...props }: TabsTriggerProps & any) {
  const { activeTab, onTabChange } = props;
  const isActive = activeTab === value;
  
  return (
    <button
      onClick={() => onTabChange?.(value)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-400 hover:text-white hover:bg-gray-700'
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ children, value, className = '', ...props }: TabsContentProps & any) {
  const { activeTab } = props;
  const isActive = activeTab === value;
  
  if (!isActive) {
    return null;
  }
  
  return (
    <div className={`mt-6 ${className}`}>
      {children}
    </div>
  );
}

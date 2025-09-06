import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, Lock, Server, Clock, Star, Users, Award, CheckCircle, FileText, Key, Eye, Zap, Database, Globe } from 'lucide-react';

const Security = () => {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: true,
    dataEncryption: true,
    auditLogging: true,
    backupEnabled: true,
    accessReports: false
  });

  const securityFeatures = [
    {
      title: 'End-to-End Encryption',
      description: 'All your data is encrypted both in transit and at rest using AES-256',
      icon: Lock,
      status: 'active',
      coverage: 100
    },
    {
      title: 'SOC 2 Type II Compliance',
      description: 'Independently audited security controls and procedures',
      icon: FileText,
      status: 'certified',
      coverage: 100
    },
    {
      title: 'Multi-Factor Authentication',
      description: 'Secure your account with multiple layers of verification',
      icon: Key,
      status: 'active',
      coverage: 95
    },
    {
      title: 'Privacy Controls',
      description: 'Granular control over data sharing and privacy settings',
      icon: Eye,
      status: 'active',
      coverage: 100
    },
    {
      title: 'Infrastructure Security',
      description: 'Cloud infrastructure with 99.9% uptime and DDoS protection',
      icon: Server,
      status: 'active',
      coverage: 99.9
    },
    {
      title: 'Regular Security Audits',
      description: 'Continuous monitoring and third-party security assessments',
      icon: Shield,
      status: 'active',
      coverage: 100
    }
  ];

  const complianceStandards = [
    { name: 'SOC 2 Type II', status: 'Certified', badge: 'success' },
    { name: 'GDPR', status: 'Compliant', badge: 'success' },
    { name: 'ISO 27001', status: 'In Progress', badge: 'warning' },
    { name: 'CCPA', status: 'Compliant', badge: 'success' },
    { name: 'HIPAA', status: 'Available', badge: 'default' }
  ];

  const securityMetrics = [
    {
      title: 'System Uptime',
      value: '99.98%',
      change: '+0.02%',
      icon: Server,
      status: 'excellent'
    },
    {
      title: 'Data Protection',
      value: '100%',
      change: '0%',
      icon: Lock,
      status: 'excellent'
    },
    {
      title: 'Security Score',
      value: '98/100',
      change: '+2',
      icon: Shield,
      status: 'excellent'
    },
    {
      title: 'Incident Response',
      value: '<1 hour',
      change: '-30min',
      icon: Zap,
      status: 'excellent'
    }
  ];

  const handleSettingChange = (setting: string, value: boolean) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Security & Reliability</h1>
          <p className="text-muted-foreground">
            Enterprise-grade security and reliability for your design platform
          </p>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-xs text-green-600">
                    {metric.change} from last month
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <metric.icon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security Features</span>
          </CardTitle>
          <CardDescription>
            Comprehensive security measures protecting your data and privacy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <feature.icon className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{feature.title}</h4>
                    <Badge 
                      variant={feature.status === 'active' ? 'default' : 'secondary'}
                    >
                      {feature.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Progress value={feature.coverage} className="flex-1" />
                    <span className="text-xs text-muted-foreground">
                      {feature.coverage}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>
            Configure your account security preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch
                id="two-factor"
                checked={securitySettings.twoFactor}
                onCheckedChange={(value) => handleSettingChange('twoFactor', value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="encryption">Data Encryption</Label>
                <p className="text-sm text-muted-foreground">
                  Encrypt all your project data and files
                </p>
              </div>
              <Switch
                id="encryption"
                checked={securitySettings.dataEncryption}
                onCheckedChange={(value) => handleSettingChange('dataEncryption', value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="audit-logging">Audit Logging</Label>
                <p className="text-sm text-muted-foreground">
                  Keep detailed logs of all account activities
                </p>
              </div>
              <Switch
                id="audit-logging"
                checked={securitySettings.auditLogging}
                onCheckedChange={(value) => handleSettingChange('auditLogging', value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="backup">Automatic Backups</Label>
                <p className="text-sm text-muted-foreground">
                  Regular backups of your projects and data
                </p>
              </div>
              <Switch
                id="backup"
                checked={securitySettings.backupEnabled}
                onCheckedChange={(value) => handleSettingChange('backupEnabled', value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="reports">Security Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Receive monthly security and access reports
                </p>
              </div>
              <Switch
                id="reports"
                checked={securitySettings.accessReports}
                onCheckedChange={(value) => handleSettingChange('accessReports', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance & Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Compliance Standards</span>
            </CardTitle>
            <CardDescription>
              Industry certifications and compliance status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {complianceStandards.map((standard, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">{standard.name}</span>
                  </div>
                  <Badge 
                    variant={standard.badge as any}
                  >
                    {standard.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Data Protection</span>
            </CardTitle>
            <CardDescription>
              How we protect and handle your data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Database className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Data Residency</h4>
                  <p className="text-sm text-muted-foreground">
                    Your data is stored in secure data centers in your region
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Globe className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Privacy by Design</h4>
                  <p className="text-sm text-muted-foreground">
                    Privacy considerations built into every feature
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Lock className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Zero-Knowledge Architecture</h4>
                  <p className="text-sm text-muted-foreground">
                    We can't access your encrypted project data
                  </p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              View Privacy Policy
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Security;
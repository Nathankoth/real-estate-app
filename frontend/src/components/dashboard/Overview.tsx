import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calculator, 
  Image, 
  Box, 
  BookOpen, 
  ArrowRight, 
  TrendingUp,
  Sparkles,
  Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const Overview = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Guide',
      description: 'Access real estate insights and API documentation',
      icon: BookOpen,
      href: '/dashboard/guide',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'ROI Calculator',
      description: 'Calculate property investment returns',
      icon: Calculator,
      href: '/dashboard/roi',
      color: 'from-green-500 to-green-600',
    },
    {
      title: '2D Generator',
      description: 'Transform property images with AI',
      icon: Image,
      href: '/dashboard/2d-generator',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: '3D Generator',
      description: 'Create immersive 3D visualizations',
      icon: Box,
      href: '/dashboard/3d-generator',
      color: 'from-amber-500 to-amber-600',
    },
  ];

  const stats = [
    {
      title: 'Projects Created',
      value: '0',
      icon: TrendingUp,
      description: 'Total projects in your account',
    },
    {
      title: 'Images Generated',
      value: '0',
      icon: Sparkles,
      description: 'AI-powered visualizations created',
    },
    {
      title: 'ROI Calculations',
      value: '0',
      icon: Calculator,
      description: 'Property analyses completed',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.user_metadata?.full_name || 'there'}!
        </h1>
        <p className="text-muted-foreground">
          Transform your real estate projects with AI-powered tools and insights.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="group hover:shadow-luxury transition-all duration-300 cursor-pointer shadow-card">
              <Link to={action.href}>
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </div>
                </CardHeader>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No recent activity</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start using our tools to see your activity here
            </p>
            <Button asChild className="mt-4 luxury-gradient shadow-button">
              <Link to="/dashboard/guide">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
'use client';

// Amplify - UI React Core
import { useAuthenticator } from '@aws-amplify/ui-react-core';

// Lucide React
import {
  Code2,
  Home,
} from 'lucide-react';

// shadcn/ui - Button
import { Button } from '@/components/ui/button';

// shadcn/ui - Sidebar
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

// メニュー項目
const groups = [
  {
    title: 'アプリケーション',
    items: [
      {
        title: 'ホーム',
        icon: Home,
        url: '/',
      },
    ],
  },
  {
    title: 'リンク',
    items: [
      {
        title: 'GitHub',
        icon: Code2,
        url: 'https://github.com/seeds-anakai/seeds-notta',
      },
    ],
  },
];

// アプリサイドバー
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // 認証
  const { signOut } = useAuthenticator();

  return (
    <Sidebar {...props}>
      <SidebarHeader className='justify-center h-16 border-b'>
        <div className='text-xl font-bold text-center'>
          seeds notta
        </div>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((group, i) => (
          <SidebarGroup key={i}>
            <SidebarGroupContent>
              <SidebarGroupLabel>
                {group.title}
              </SidebarGroupLabel>
              <SidebarMenu>
                {group.items.map((item, i) => (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className='justify-center h-16 border-t'>
        <Button variant='secondary' onClick={signOut}>
          ログアウト
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

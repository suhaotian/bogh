'use client';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Badge } from '@chakra-ui/react';
import { useEffect } from 'react';

import { RepoList } from './components/repo-list';
import Signin from './components/signin';
import { StarList } from './components/star-list';
import { WatchList } from './components/watch-list';
import { useStore, actions } from './state';

export default function Home() {
  const [state] = useStore();

  useEffect(() => {
    actions.loadCache();
  }, []);

  if (!state.accessToken) {
    return <Signin />;
  }

  return (
    <Tabs isLazy={true}>
      <TabList className="sticky top-[48px] md:top-[64px] bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-white z-10 bg-opacity-90">
        <Tab>
          Repos{' '}
          {state.repos.length > 0 && (
            <Badge size={'sm'} className="ml-2" colorScheme="yellow">
              {state.repos.length}
            </Badge>
          )}
        </Tab>
        <Tab>
          Stars{' '}
          {state.stars.length > 0 && (
            <Badge size={'sm'} className="ml-2" colorScheme="yellow">
              {state.stars.length}
            </Badge>
          )}
        </Tab>
        <Tab>
          Watchs{' '}
          {state.watchs.length > 0 && (
            <Badge size={'sm'} className="ml-2" colorScheme="yellow">
              {state.watchs.length}
            </Badge>
          )}
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <RepoList />
        </TabPanel>
        <TabPanel>
          <StarList />
        </TabPanel>
        <TabPanel>
          <WatchList />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

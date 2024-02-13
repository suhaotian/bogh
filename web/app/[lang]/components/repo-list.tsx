'use client';

import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Checkbox,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { LogList } from './log-list';
import * as m from '../../../src/paraglide/messages';
import { actions, useStore } from '../state';

export function RepoList() {
  const [state] = useStore();
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    actions.getAllRepos().catch((e) => {
      setError(e.message);
    });
  }, []);

  let total = 0;
  return (
    <div className="flex flex-wrap">
      {state.reposLoading ? <Spinner className="dark:text-white" /> : null}
      {error ? (
        <Alert status="error" className="mb-4 rounded">
          <AlertIcon />
          {error}
        </Alert>
      ) : null}
      {state.repos.map((item, idx) => {
        const date = new Date(item.created_at as string);
        const checked = !!state.deleteRepos[item.id];
        const disabled = !!state.deletedRepos?.[item.id];
        if (checked && !disabled) {
          total += 1;
        }
        return (
          <div
            key={item.id}
            className="mb-3 px-2 w-1/2 md:w-1/3 lg:w-1/4 2xl:w-1/5 flex flex-col relative dark:text-white">
            <h3 className="font-semibold flex gap-2 items-center flex-wrap">
              <Checkbox
                colorScheme="red"
                defaultChecked={checked}
                isDisabled={disabled}
                onChange={() => {
                  actions.selectDeleteRepo(item.id);
                }}
              />{' '}
              {idx}. {item.name} {item.archived && <Badge colorScheme="red">ARCHIVED</Badge>}{' '}
              {item.fork && <Badge colorScheme="telegram">FORK</Badge>}
              {item.private ? <Badge>PRIVATE</Badge> : <Badge>PUBLIC</Badge>}
              <a href={item.html_url} target="_blank" className="text-blue-400">
                <ExternalLinkIcon />
              </a>
            </h3>
            <div className="flex items-center text-xs gap-2 mt-1 mb-2 text-slate-600">
              <img src={item.owner.avatar_url} alt="avatar" className="w-4" />
              {item.owner.login} {date.toLocaleDateString()} {date.toLocaleTimeString()}
            </div>
            <p className="text-sm text-slate-700 line-clamp-3">{item.description}</p>

            <div className="border-b mt-auto pt-4 border-dashed dark:border-slate-700"></div>
          </div>
        );
      })}

      {
        <div className="fixed right-6 bottom-8 z-10">
          <Popover>
            <PopoverTrigger>
              <Button
                colorScheme="red"
                size={'lg'}
                isLoading={state.deleteReposLoading}
                isDisabled={state.deleteReposLoading}>
                {m.confirm_delete()} ({total})
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>{m.confirm()}?</PopoverHeader>
              <PopoverBody>
                {!state.deleteReposLoading && (
                  <div className="flex justify-between gap-2">
                    <Button className="flex-1" colorScheme="red" onClick={actions.deleteRepos}>
                      {m._delete()}
                    </Button>
                    <Button
                      className="flex-1"
                      colorScheme="red"
                      variant={'outline'}
                      onClick={actions.archiveRepos}>
                      {m.archive_only()}
                    </Button>
                  </div>
                )}
                <LogList />
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </div>
      }
    </div>
  );
}

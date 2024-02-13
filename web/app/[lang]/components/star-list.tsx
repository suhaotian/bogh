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

export function StarList() {
  const [error, setError] = useState('');

  const [state] = useStore();

  useEffect(() => {
    setError('');
    actions.getAllStars().catch((e) => {
      setError(e.message);
    });
  }, []);

  let total = 0;
  return (
    <div className="flex flex-wrap">
      {state.starsLoading ? <Spinner className="dark:text-white" /> : null}
      {error ? (
        <Alert status="error" className="mb-4 rounded">
          <AlertIcon />
          {error}
        </Alert>
      ) : null}
      {state.stars.map((item, idx) => {
        const date = new Date(item.created_at as string);
        const checked = !!state.cancelStars?.[item.id];
        const disabled = !!state.canceledStars?.[item.id];
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
                  actions.selectUnstarRepo(item.id);
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
              <img src={item.owner.avatar_url} alt="" className="w-4" />
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
                isLoading={state.cancelStarsLoading}
                isDisabled={state.cancelStarsLoading}>
                {m.confirm()} ({total})
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>{m.confirm_cancel_stars()}</PopoverHeader>
              <PopoverBody>
                {!state.cancelStarsLoading && (
                  <Button
                    onClick={actions.cancelStars}
                    colorScheme="red"
                    className="w-full"
                    variant={'outline'}>
                    {m.confirm()}
                  </Button>
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

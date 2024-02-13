'use client';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Input,
  Button,
  AlertIcon,
  Alert,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { useState } from 'react';

import * as m from '../../../src/paraglide/messages';
import { useStore, actions } from '../state';

export default function Signin() {
  const [state] = useStore();

  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = () => {
    setLoading(true);
    setError('');
    actions
      .setToken(token)
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const errorEl = error ? (
    <Alert status="error" className="mb-4 rounded">
      <AlertIcon />
      {error}
    </Alert>
  ) : null;

  return (
    <div className="pt-12 px-8 max-w-screen-md mx-auto">
      {errorEl}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}>
        <InputGroup size="lg">
          <Input
            placeholder="Access token"
            className="dark:text-white dark:border-slate-600"
            type={show ? 'text' : 'password'}
            autoFocus
            required
            onChange={(e) => {
              setToken(e.target.value.trim());
            }}
          />
          <InputRightElement width="4.5rem">
            <Button size="md" onClick={handleClick} variant={'link'}>
              {show ? <ViewIcon /> : <ViewOffIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
        <Popover>
          <PopoverTrigger>
            <p className="inline-block text-sm mt-2 text-blue-400 cursor-pointer" title="help">
              {m.access_token({ data: '' })} <b>Access Token</b>?
            </p>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>{m.steps()}</PopoverHeader>
            <PopoverBody>
              <p className="text-sm">
                {m.step_1()}
                <a
                  className="text-blue-400 px-2"
                  target="_blank"
                  href="https://github.com/settings/tokens/new?scopes=repo,delete_repo,user,notifications">
                  github.com/settings/tokens/new
                </a>
              </p>
              <p className="text-sm mt-2"> {m.step_2()}</p>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        <Button
          className="w-full mt-6"
          type="submit"
          size="lg"
          colorScheme="blue"
          isLoading={loading || !state.ready}
          isDisabled={!token}>
          {m.next()}
        </Button>
      </form>
    </div>
  );
}

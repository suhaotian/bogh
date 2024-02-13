/* eslint-disable @next/next/no-img-element */
'use client';

import { SunIcon } from '@chakra-ui/icons';
import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/react';
import Image from 'next/image';
import { useState } from 'react';

import * as m from '../../../src/paraglide/messages';
import iconGithub from '../icons/github.svg';
import iconLanguage from '../icons/language.svg';
import logo from '../icons/logo.jpeg';
import iconLogout from '../icons/logout.svg';
import moonIcon from '../icons/moon.svg';
import { actions, useStore } from '../state';

export function Header() {
  return (
    <div className="sticky top-0 bg-white dark:bg-slate-800 dark:text-white z-20 px-4 py-2 bg-opacity-90 flex justify-between items-center">
      <h1 className="font-bold flex flex-col md:flex-row items-center gap-2">
        <Image
          src={logo}
          alt="BOGH"
          height={36}
          width={36}
          className="rounded h-10 w-10 md:h-12 md:w-12"
        />
        <div className="flex-col hidden md:flex">
          <span>BOGH</span>
          <span className="text-xs font-light text-slate-400 dark:text-slate-200">
            {m.slogan()}
          </span>
        </div>
      </h1>
      <div className="flex gap-4 md:gap-8 items-center select-none">
        <LanguageSwitcher />
        <ThemeSwitcher />
        <div>
          <a href="https://github.com/suhaotian/bogh" target="_blank">
            <img src={iconGithub.src} alt="GitHub, Source Code" className="h-7" />
          </a>
        </div>
        <LogoutBtn />
      </div>
    </div>
  );
}

function LanguageSwitcher() {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="cursor-pointer">
          <img src={iconLanguage.src} alt="Languages" className="h-6" />
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader className="dark:text-black">{m.switch_language()}</PopoverHeader>
        <PopoverBody>
          <a href="/zh-Hans" className="w-full block py-2 text-blue-500">
            简体中文
          </a>
          <a href="/en" className="w-full block py-2 text-blue-500">
            English
          </a>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

function ThemeSwitcher() {
  const [dark, setDark] = useState(false);
  function toggleDark() {
    toggleClassDark();
    setDark((state) => !state);
  }

  return (
    <>
      <div className="flex gap-2 items-center cursor-pointer" onClick={toggleDark}>
        {dark ? (
          <img
            src={moonIcon.src}
            key="1"
            alt="moon"
            className="!h-6 !w-6 animate--animated animate--swing block dark:"
          />
        ) : (
          <SunIcon
            key="2"
            className="!h-6 !w-6 animate--animated animate--jello block"
            color="#777"
          />
        )}
      </div>
    </>
  );
}

function LogoutBtn() {
  const [state] = useStore();

  return state.accessToken ? (
    <Popover>
      <PopoverTrigger>
        <a className="cursor-pointer" title="Logout">
          <img src={iconLogout.src} alt="Logout" className="h-7" />
        </a>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader className="dark:text-black">{m.logout()}</PopoverHeader>
        <PopoverBody>
          <Button onClick={actions.reset} colorScheme="red" className="w-full">
            {m.confirm()}
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  ) : null;
}

function toggleClassDark() {
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.removeAttribute('style');
  } else {
    document.documentElement.setAttribute('style', 'color-scheme: dark;');
  }
  document.documentElement.classList.toggle('dark');
}

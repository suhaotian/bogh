import * as m from '../../../src/paraglide/messages';

export function Footer() {
  return (
    <footer className="p-8 mt-8 ">
      <div className="text-sm font-extralight text-slate-600 dark:text-white flex items-center  justify-center gap-4">
        <a className="text-blue-500" href="https://github.com/suhaotian" target="_blank">
          © 2024 suhaotian
        </a>
        <span>{m.more()}</span>
        <a
          className="text-blue-500"
          href="https://github.com/suhaotian/bogh/issues"
          target="_blank">
          {m.feedback()}
        </a>
        <a className="text-blue-500" href="https://github.com/suhaotian/bogh" target="_blank">
          {m.source_code()}
        </a>
        <a className="text-blue-500" href="https://tsdk.dev" target="_blank">
          tsdk
        </a>
      </div>
    </footer>
  );
}

import { Suspense } from 'react';

import Link from 'next/link';

import { ScrollIndicator } from '@/components/design/scroll-indicator';
import { Icons } from '@/components/icons';
import { GridPattern } from '@/components/magicui/grid-pattern';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { buttonVariants } from '@/components/ui/button';
import { Spotlight } from '@/components/ui/spotlight';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { getGithubStars } from '@/lib/github';
import { getHooksCount } from '@/lib/hooks';
import { cn } from '@/lib/utils';

import { siteConfig } from '@/config/site';

export async function Hero() {
  const hooksCount = getHooksCount();
  const githubStars = await getGithubStars();

  return (
    <div
      id="hooks-hero"
      className={cn(
        'relative w-full h-[calc(100dvh-65px)]',
        'flex flex-col items-center justify-center grow gap-8',
        'border-b ',
      )}
    >
      <hgroup
        className={cn(
          'text-center',
          'z-10',
          'flex flex-col items-center justify-center gap-4',
          'px-3 lg:px-0',
        )}
      >
        <h1
          className={cn(
            'text-3xl md:text-5xl lg:text-6xl font-bold',
            'max-w-[18ch]',
          )}
        >
          基于AI驱动的<br/>
          共创性知识库与学习平台
        </h1>
        <p className={cn('text-sm lg:text-base max-w-[40ch]')}>
          利用AI构筑摘要总结、智能检索、智能出题、新员工学习路线等
          <span className={cn('font-bold')}>10+ Agent</span>能力.
          利用趣味性机制鼓励知识的共创、共享，有好的idea欢迎联系.
        </p>
      </hgroup>
      <div
        className={cn(
          'z-10 flex flex-col lg:flex-row lg:items-center justify-center gap-4 w-3/4',
          'px-4 lg:px-0',
        )}
      >
        <Link
          href="/docs"
          className={cn(
            buttonVariants({ variant: 'default', size: 'lg' }),
            'group hover:scale-[1.025]',
            // Override primary color to keep black/white aesthetic
            'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200',
          )}
        >
          开启探索
          <Icons.Chevron.Right className="size-4 group-hover:translate-x-1 duration-200 transition-transform" />
        </Link>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              className={cn(
                buttonVariants({ variant: 'secondary', size: 'lg' }),
                'group hover:scale-[1.025] gap-2',
              )}
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>上传个人知识卡片</span>
              <Icons.Star className="size-4 group-hover:scale-[1.25] duration-200 transition-transform" />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <Suspense
              fallback={
                <p className="text-sm text-accent-foreground">
                  Counting stars...
                </p>
              }
            >
              <p className="text-sm text-accent-foreground">
                当前共 <NumberTicker value={githubStars} /> 个知识卡片.
              </p>
            </Suspense>
          </TooltipContent>
        </Tooltip>
      </div>
      <ScrollIndicator
        className={cn(
          'absolute left-8 lg:left-1/2 lg:-translate-x-1/2 bottom-8',
        )}
      />
      <p
        className={cn(
          'absolute bottom-8 right-8',
          'text-sm text-muted-foreground',
        )}
      >
        累计已认证 {hooksCount}+ 贡献者.
      </p>
      <Spotlight
        className="-top-20 left-0 md:-top-40 md:left-80"
        fill="white"
      />
      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray={'4 2'}
        className={cn(
          '[mask-image:radial-gradient(640px_circle_at_center,white,transparent)]',
        )}
      />
    </div>
  );
}

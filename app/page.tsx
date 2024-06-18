'use client';

import { Button, CardFooter, Chip } from '@nextui-org/react';
import { NextUIProvider } from "@nextui-org/react";
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import useData from './use-data';
import { Listbox, ListboxItem, ListboxSection, Spinner } from "@nextui-org/react";
import { Card, CardHeader, CardBody, Image as NextImage } from "@nextui-org/react";
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {

  return (
    <NextUIProvider>
      <Suspense>
        <div className='w-full h-screen flex flex-col items-center justify-center'>
          <div className="flex flex-col w-[300px] h-[300px] overflow-y-auto">
            <SearchList />
          </div>
        </div>
      </Suspense>
    </NextUIProvider>
  );
}

let weekKeys = ["1", "2", "3", "4", "5", "6", "7"];
let weekString = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
let jpnWeekString = ["月", "火", "水", "木", "金", "土", "日"];

// shuffle to start from now day
const now = new Date();
const day = now.getDay();
weekKeys = weekKeys.slice(day - 1).concat(weekKeys.slice(0, day - 1));
weekString = weekString.slice(day - 1).concat(weekString.slice(0, day - 1));
jpnWeekString = jpnWeekString.slice(day - 1).concat(jpnWeekString.slice(0, day - 1));

function SearchList() {

  const { data, error, loading, refresh } = useData();

  const search = useSearchParams();
  const spCallbackToken = search?.get('spCallbackToken');
  const origin = search?.get('origin');

  useEffect(() => {
    if (error) {
      return;
    }

    if (!data) {
      return;
    }

    if (!spCallbackToken) {
      return;
    }

    const text = weekKeys.map((key, index) => {
      return data?.week?.[key].map((anime) => {
        const id = anime.id;
        const info = data?.info?.find((item) => item.id === id);
        let text = `-----\n星期${key} / ${jpnWeekString[index]} / ${anime.name} / ${info?.episode_sum} Episodes / ${info?.show_year} / ${info?.show_quarter} / ${info?.show_month_day} / ${info?.show_time} / ${info?.tag.join('、')}`;
        text += `\n${anime.name}`;
        text += `\n-----`;
        return text;
      }).join('\n');
    }).join('\n\n');

    window.parent.postMessage({
      type: 'spell-response',
      token: spCallbackToken,
      content: text
    }, origin || '*');

  }, [data, error, origin, spCallbackToken]);

  if (loading || !data) {
    return <div className='flex flex-row items-center justify-center h-[300px]'>
      <Spinner />
    </div>;
  }

  if (error) {
    return <div className='flex flex-row items-center justify-center h-[300px]'>
      <p>Error: {error.message}</p>
      <Button onClick={refresh}>Try again</Button>
    </div>;
  }

  return (
    <div>
      <div>
        {data?.week ? weekKeys.map((key, index) => {
          return (
            <div title={
              weekString[parseInt(key) - 1]
            } key={key}>
              {data?.week?.[key].map((anime) => {

                const id = anime.id;
                const info = data?.info?.find((item) => item.id === id);

                return (
                  <Link href={`https://www.miluxing.com/`} key={anime.id} target='_blank'>
                    <Card key={anime.id} className="pb-4 mb-2 group cursor-pointer" radius='none'>
                      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                        <p className="text-tiny uppercase font-bold">{weekString[index]} / 星期{key} / {jpnWeekString[index]}</p>
                        <small className="text-default-500">{info?.episode_sum} Episodes / {info?.show_year} / {info?.show_quarter} / {info?.show_month_day} / {info?.show_time}</small>
                        <h4 className="font-bold text group-hover:underline">{anime.name}</h4>
                      </CardHeader>
                      <CardBody className="overflow-visible py-2">
                        <Image
                          alt="Card background"
                          className="object-cover rounded-xl h-40 w-full mb-2"
                          src={anime.cover}
                          width={270}
                          height={180}
                        />
                        <p className="text-default-500 text-small line-clamp-3">
                          {info?.intro}
                        </p>
                      </CardBody>
                      <CardFooter>
                        {info?.tag.map((tag) => {
                          return <Chip key={tag} className="text-tiny text-default-500 mr-2">{tag}</Chip>
                        })}
                      </CardFooter>
                    </Card>
                  </Link>
                );
              })}
            </div>
          );
        }) : <div>
          <p>No data</p>
        </div>}
      </div>

    </div>
  );
}
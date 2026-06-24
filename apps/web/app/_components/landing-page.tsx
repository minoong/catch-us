"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion, useReducedMotion } from "motion/react";

import Aurora from "@/components/Aurora";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

const memories = [
  {
    title: "위치",
    value: "37.5665, 126.9780",
    description: "사진의 좌표를 주소와 지도 마커로 연결",
  },
  {
    title: "키워드",
    value: "밤 산책 · 노을 · 카페",
    description: "이미지 분석으로 추억을 검색 가능한 단서로 변환",
  },
  {
    title: "사람",
    value: "우리 둘 · 친구 · 게스트",
    description: "인물과 유사 이미지로 다시 찾는 개인 사진 아카이브",
  },
];

const floatingPhotos = [
  "서울 저녁",
  "도쿄 횡단보도",
  "파리 골목",
  "바다 산책",
  "캡처 제외",
];

const auroraColorStops = ["#8b5cf6", "#22d3ee", "#f472b6"];

export function LandingPage() {
  const reduceMotion = useReducedMotion();
  const floatingRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      floatingRefs.current.forEach((node, index) => {
        if (!node) {
          return;
        }

        gsap.to(node, {
          y: index % 2 === 0 ? -18 : 16,
          x: index % 2 === 0 ? 10 : -12,
          rotate: index % 2 === 0 ? 2 : -2,
          duration: 3.6 + index * 0.35,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
    });

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <main className="bg-background text-foreground min-h-screen overflow-hidden">
      <section className="relative isolate flex min-h-screen items-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,var(--accent),transparent_34%),linear-gradient(135deg,var(--background),var(--muted),var(--background))]" />
        <div className="absolute inset-x-0 top-0 -z-10 h-96 opacity-80">
          <Aurora
            amplitude={0.9}
            blend={0.55}
            colorStops={auroraColorStops}
            speed={0.55}
          />
        </div>
        <div className="from-background via-background/80 absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-linear-to-t to-transparent" />

        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.82fr)] lg:items-center">
          <div className="flex flex-col gap-7 pt-16 sm:pt-20 lg:pt-0">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 18 }}
              transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <Badge variant="secondary">Private photo memory engine</Badge>
              <span className="text-muted-foreground text-sm">
                위치, 사람, 분위기로 다시 찾는 일상
              </span>
            </motion.div>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="flex max-w-4xl flex-col gap-5"
              initial={{ opacity: 0, y: 24 }}
              transition={{
                delay: 0.08,
                duration: 0.7,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
            >
              <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
                흩어진 사진을{" "}
                <span className="text-muted-foreground block">
                  기억의 지도처럼.
                </span>
              </h1>
              <p className="text-muted-foreground max-w-2xl text-base leading-7 sm:text-lg">
                Catch Us는 너와 여자친구의 일상 사진을 위치, 날짜, 키워드, 인물
                단서로 정리해서 나중에 “그날 거기”를 자연스럽게 다시 찾게 해주는
                개인 사진 서비스입니다.
              </p>
            </motion.div>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-3 sm:flex-row"
              initial={{ opacity: 0, y: 24 }}
              transition={{
                delay: 0.16,
                duration: 0.7,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
            >
              <Button size="lg">사진 둘러보기 준비 중</Button>
              <Button size="lg" variant="outline">
                지도 보기 프리뷰
              </Button>
            </motion.div>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-3 sm:grid-cols-3"
              initial={{ opacity: 0, y: 24 }}
              transition={{
                delay: 0.24,
                duration: 0.7,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
            >
              {memories.map((item) => (
                <Card
                  className="border-border/70 bg-card/70 shadow-sm backdrop-blur"
                  key={item.title}
                >
                  <CardHeader>
                    <CardDescription>{item.title}</CardDescription>
                    <CardTitle className="text-base">{item.value}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-6">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>

          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative min-h-[28rem] sm:min-h-[34rem] lg:min-h-[42rem]"
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            transition={{
              delay: 0.18,
              duration: 0.8,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
          >
            <div className="bg-card/60 absolute inset-0 rounded-[2rem] border shadow-2xl backdrop-blur-xl" />
            <div className="bg-background/70 absolute inset-4 overflow-hidden rounded-[1.5rem] border">
              <div className="flex h-full flex-col justify-between p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-xs">오늘의 기억</p>
                    <h2 className="text-xl font-semibold">Seoul, 21:42</h2>
                  </div>
                  <Badge>공개</Badge>
                </div>

                <div className="relative min-h-72 flex-1">
                  {floatingPhotos.map((label, index) => (
                    <div
                      className="bg-card/90 absolute rounded-3xl border p-3 shadow-xl backdrop-blur"
                      key={label}
                      ref={(node) => {
                        floatingRefs.current[index] = node;
                      }}
                      style={{
                        left: `${8 + (index % 3) * 29}%`,
                        top: `${12 + index * 13}%`,
                        transform: `rotate(${index % 2 === 0 ? -4 : 5}deg)`,
                        width: index === 2 ? "46%" : "40%",
                      }}
                    >
                      <div className="from-muted via-background to-accent aspect-4/3 rounded-2xl bg-linear-to-br" />
                      <p className="mt-3 text-sm font-medium">{label}</p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        위치와 키워드 분석 대기
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-background/75 grid gap-3 rounded-2xl border p-4 sm:grid-cols-3">
                  <div>
                    <p className="text-2xl font-semibold">128</p>
                    <p className="text-muted-foreground text-xs">
                      이번 달 사진
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">34</p>
                    <p className="text-muted-foreground text-xs">지도 마커</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">9</p>
                    <p className="text-muted-foreground text-xs">인물 그룹</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

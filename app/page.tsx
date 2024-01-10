
'use client'

import { MotionValue, Variants, motion, motionValue, useInView, useTransform } from "framer-motion"
import React, { useEffect, useRef, useState } from "react"

import IMAGE_1 from './images/1.jpg'
import IMAGE_2 from './images/2.jpg'
import IMAGE_3 from './images/3.jpg'
import IMAGE_4 from './images/4.jpg'
import IMAGE_5 from './images/5.jpg'
import Image, { StaticImageData } from "next/image"
import { useViewStore } from "@/store"

import Lenis from '@studio-freight/lenis'

export const Wrapper = "p"

type AnimatedTextProps = {
  text: string,
  className?: string,
  setIsTextInView: React.Dispatch<React.SetStateAction<boolean>>,
}

const textAnimationVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1
    }
  }
}

export const AnimatedText = ({
  text,
  className = "",
  setIsTextInView
}: AnimatedTextProps) => {

  const textRef = useRef<HTMLSpanElement>(null)

  const inView = useInView(textRef, {
    once: true,
  })

  useEffect(() => {
    setIsTextInView(inView)
  }, [inView])

  return (
    <Wrapper className={className}>
      <motion.span
        ref={textRef}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        transition={{ staggerChildren: 0.05, delayChildren: 0.1, ease: "easeIn ", duration: 0.25 }}
      >
        {text.split("").map((char =>
          <motion.span
            key={char}
            className="inline-block px-1"
            variants={textAnimationVariants}
          >{char}</motion.span>))}
      </motion.span>
    </Wrapper>
  )
}

export type HeroProps = {
  text: string,
  small?: boolean
}

const Hero = ({ text, small }: HeroProps) => {
  const [isTextInView, setIsTextInView] = useState(false)

  const backgroundVariants: Variants = {
    hidden: {
      backgroundColor: "#ffffff"
    },
    visible: {
      //backgroundColor: "#D2B48C", hex for white smoke 
      backgroundColor: "#F5F5F5",
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate={isTextInView ? "visible" : "hidden"}
      //variants={backgroundVariants}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="w-full h-screen relative flex flex-col items-center justify-center">
      <h1 style={{ color: "#3E2723" }} className={`${small ? 'text-3xl' : 'text-9xl'} font-semibold`}>
        <AnimatedText key={text} text={text} setIsTextInView={setIsTextInView} />
      </h1>
      <motion.p
        initial="hidden"
        animate={isTextInView ? "visible" : "hidden"}
        variants={{
          hidden: {
            opacity: 0,
            y: 24
          },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.5,
            }
          }
        }}
        className="absolute text-lg bottom-6 text-center">
        Simple illustrations of framer motion with sticky section and lenis scroll
        <br />
        <span className="text-base">
          by @lazycodebaker
        </span>
      </motion.p>
    </motion.div>
  )
}

export type TitleProps = {
  item: Item
}

const titleAnimationVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      // delay: 0.5
    }
  }
}

const Title = ({ item }: TitleProps) => {

  const ref = useRef<HTMLSpanElement>(null)

  const inView = useInView(ref, {
    once: true,
    margin: "-50% 0px -50% 0px"
  })

  const setInviewTitle = useViewStore(state => state.setInviewTitle)

  useEffect(() => {
    if (inView) {
      setInviewTitle(item.id)
    } else {
      setInviewTitle(null)
    }
  }, [inView])

  return (
    <motion.span
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      style={{
        color: item.textColor ? item.textColor : "#3E2723"
      }}
    >
      <motion.h2
        variants={titleAnimationVariants}
        className="text-5xl font-semibold"
      >
        {item.title}
      </motion.h2>
      <motion.p
        variants={titleAnimationVariants}
        className="text-lg"
      >
        {item.content}
      </motion.p>
    </motion.span>
  )
}

const cardAnimationVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 1
    }
  }
}

const Card = ({ item }: TitleProps) => {

  const inViewTitle = useViewStore(state => state.inViewTitle)

  return (
    <motion.div
      initial="hidden"
      animate={inViewTitle === item.id ? "visible" : "hidden"}
      variants={cardAnimationVariants}
      transition={{ ease: "easeInOut", duration: 0.5, delay: 0.5 }}
      className="h-full w-full top-0 absolute">
      <Image
        src={item.image}
        alt={item.title}
        layout="fill"
        objectFit="cover"
        objectPosition="center"
      />
    </motion.div>
  )
}

const StickSection = () => {

  const inViewTitle = useViewStore(state => state.inViewTitle)

  const bgColor = lists.find(item => item.id === inViewTitle)?.bgColor

  const backgroundVariants: Variants = {
    hidden: {
      backgroundColor: "#ffffff"
    },
    visible: {
      backgroundColor: bgColor
    }
  }

  return (
    <motion.section
      initial="hidden"
      animate={inViewTitle ? "visible" : "hidden"}
      variants={backgroundVariants}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="flex gap-20">
      <div className="w-full">
        <ul className="mx-8">
          {lists.map((item) => (
            <li key={item.id} className="flex my-[50vh] flex-col">
              <Title item={item} />
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full h-screen sticky top-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          {lists.map((item) => (<Card item={item} />))}
        </div>
      </div>
    </motion.section >
  )
}

export type Item = {
  id: number,
  title: string,
  content: string,
  image: StaticImageData,
  bgColor: string,
  textColor?: string
}

const lists: Item[] = [
  {
    id: 1,
    title: "Eiffel Tower Elegance",
    content: "A romantic night view of the Eiffel Tower illuminated against the Parisian skyline.",
    image: IMAGE_1,
    bgColor: "#e0e1e3"
  },
  {
    id: 2,
    title: "Artistic Vibes in Montmartre",
    content: "Quaint cobblestone streets lined with artists' studios and cafes in the bohemian neighborhood of Montmartre.",
    image: IMAGE_2,
    bgColor: "#c4ab95"
  },
  {
    id: 3,
    title: "Art at the Louvre",
    content: "A captivating shot of the Louvre Museum showcasing its iconic glass pyramid and the surrounding courtyard.",
    image: IMAGE_3,
    bgColor: "#4f696d",
    textColor: "#F5F5F5"
  },
  {
    id: 4,
    title: "Cruising the Seine",
    content: "A peaceful scene of a boat cruising along the Seine River with the cityscape in the background.",
    image: IMAGE_4,
    bgColor: "#72b7d4"
  },
  {
    id: 5,
    title: "Sweet Treats of Paris",
    content: "A tempting display of delicious French pastries like croissants, macarons, and éclairs.",
    image: IMAGE_5,
    bgColor: "#e5c8a8"
  }
]

const JustSomeSpace = () => {
  return (
    <div className="h-screen w-full"></div>
  )
}

export default function Home() {

  const [pageYScroll, setPageYScroll] = useState<MotionValue>(motionValue(0))

  useEffect(() => {
    const lenis = new Lenis({
      easing: (t: any) => t * t * t,
      duration: 1000,
      lerp: 0.1,
      wheelMultiplier: 0.5,
    })

    lenis.on('scroll', (e: any) => {
      // console.log(e)
      const from = e.animate.from

      setPageYScroll(motionValue(from))
    })

    function raf(time: any) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])

  const size = useTransform(pageYScroll, [1, 5000], [1, 10000])

  return (
    <main className="w-full">
      <motion.div
        style={{
          width: size,
          height: size,
          top: "44%",
          left: "55%",
          transform: "translate(-50%, -50%)",
          position: "fixed"
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="z-10 rounded-full bg-red-800/10 w-4 h-4">
        &nbsp;
      </motion.div>
      <Hero text="Paris" />
      <StickSection />

      <Hero text="Easiest way to use sticky with title" small={true} />
    </main>
  )
}

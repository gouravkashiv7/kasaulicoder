"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { Plus } from "lucide-react";
import type React from "react";
import { useRef } from "react";

const techStack = [
  {
    name: "Next.js",
    path: "M18.665 21.978L6.613 6.611H5.111V17.389H6.612V8.402L17.5 21.978H18.665ZM12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM12 22.5C6.201 22.5 1.5 17.799 1.5 12C1.5 6.201 6.201 1.5 12 1.5C17.799 1.5 22.5 6.201 22.5 12C22.5 12.871 22.391 13.716 22.189 14.521L11.516 6.611H10.012V17.389H11.513V13.012L12 13.633V13.634L18.841 22.527C16.924 23.771 14.576 24.5 12 24.5V22.5Z",
    color: "#ffffff",
  },
  {
    name: "React",
    path: "M24 10.657c0-1.144-.705-2.222-1.928-3.007a11.235 11.235 0 00-4.321-1.587 13.652 13.652 0 00-11-1.5a11.254 11.254 0 00-4.493 2.1c-1.103.82-1.745 1.838-1.745 2.84 0 1.144.706 2.222 1.928 3.007 1.222.784 2.872 1.353 4.621 1.637a13.619 13.619 0 0010.7 1.45 11.235 11.235 0 004.492-2.1c1.103-.82 1.746-1.838 1.746-2.84zm-6.191-4.702c-.378-.052-.76-.088-1.146-.109-.168-.009-.336-.014-.504-.014a13.644 13.644 0 00-11.458 6.516 11.235 11.235 0 00-.737 4.63c.053 1.141.365 2.204 1.05 3.102.686.898 1.439 1.465 2.624 2.046a11.235 11.235 0 004.63.737c1.141-.053 2.204-.365 3.102-1.05a11.235 11.235 0 003.551-3.671 13.644 13.644 0 001.373-11.085 11.235 11.235 0 00-2.485-1.102z",
    color: "#61DAFB",
  },
  {
    name: "TypeScript",
    path: "M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0H1.125zM12.923 18.232c-.104.306-.279.529-.536.671-.256.142-.516.213-.777.213-.26 0-.52-.071-.777-.213-.256-.142-.435-.365-.54-.671v-6.745h5.308v6.745zm.811-10.456l3.52 1.246V18.232l-3.52-1.246V7.776zm1.145 9.028a.56.56 0 00.56.56.56.56 0 00.56-.56.56.56 0 00-.56-.56.56.56 0 00-.56.56zm4.846-9.15l-3.52 1.246V18.232l3.52-1.246V7.654zm.135 1.142a.56.56 0 01.56.56.56.56 0 01-.56.56.56.56 0 01-.56-.56.56.56 0 01.56-.56z",
    color: "#3178C6",
  },
  {
    name: "Tailwind CSS",
    path: "M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8 1.343.336 2.304 1.315 3.368 2.399C15.312 11.965 17.502 14.2 21.601 14.2c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-1.343-.336-2.304-1.315-3.368-2.399C18.291 7.035 15.101 4.8 12.001 4.8zM6.001 14.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8 1.343.336 2.304 1.315 3.368 2.399 1.741 1.776 3.931 4.01 8.03 4.01 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-1.343-.336-2.304-1.315-3.368-2.399C12.292 16.435 9.102 14.2 6.001 14.2z",
    color: "#06B6D4",
  },
  {
    name: "Three.js",
    path: "M13.629 11.758c0 1.03-.84 1.868-1.868 1.868a1.868 1.868 0 01-1.868-1.868c0-1.034.84-1.872 1.868-1.872.483 0 .93.18 1.28.49l1.39-1.39a3.81 3.81 0 00-2.67-.97c-2.13 0-3.868 1.734-3.868 3.872S9.63 15.626 11.761 15.626c1.166 0 2.247-.532 2.943-1.462l-1.378-1.378c-.246.425-.56.68-.897.802a1.868 1.868 0 01-.19-.83zm.186 2.012c0 .324.263.587.587.587h1.173a.587.587 0 00.587-.587v-2.346a.587.587 0 00-.587-.587h-1.173a.587.587 0 00-.587.587v2.346zM24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zm-1.5 0a10.5 10.5 0 10-21 0 10.5 10.5 0 0021 0z",
    color: "#ffffff",
  },
  {
    name: "Framer Motion",
    path: "M0 0h24v12l-12 12L0 12V0zm12 12L0 0v12l12 12V12z",
    color: "#0055FF",
  },
  {
    name: "MongoDB",
    path: "M17.193 9.56c-.657-3.957-2.67-6.529-5.111-9.56-.123-.153-.265-.153-.388 0-1.957 2.457-4.102 4.97-4.945 8.718-.844 3.747.018 7.332 3.033 9.873v2.85c0 .329.28.6.61.6H13.8c.343 0 .61-.283.61-.635v-2.65c4.015-2.074 4.545-6.619 3.99-9.296h-.007zm-5.111 7.218c-.3 0-.543-.243-.543-.543V3.129c1.943 2.5 3.328 4.414 3.828 7.428.472 2.7-.128 5.485-3.285 6.221z",
    color: "#47A248",
  },
  {
    name: "Vercel",
    path: "M24 22.525H0l12-21.05 12 21.05z",
    color: "#ffffff",
  },
  {
    name: "PostCSS",
    path: "M11.996 24V14.996h4.5v4.5H24v-12h-4.5v4.5h-4.5V1.5H0V15h4.5v-4.5h4.5V15h4.5v9h-1.504z",
    color: "#DD3A0A",
  },
  {
    name: "Node.js",
    path: "M10.455 12.637v7.423l6.432-3.711V8.926l-6.432-3.712V12.637zm-1.545 1.782l-6.425-3.71v7.42l6.425 3.708v-7.418zm1.545-12.235l6.432 3.712 6.425-3.712-6.425-3.712-6.432 3.712zm7.977 15.545l6.425-3.71V8.926l-6.425 3.71v7.419zM0 6.645v13.355l11.564 6.671 11.564-6.671V6.645L11.564-.027 0 6.645z",
    color: "#5FA04E",
  },
  {
    name: "SASS",
    path: "M17.883 12.443c-.768-1.516-2.583-2.628-4.562-2.854-1.12-.132-2.106.147-2.674.724a.8.8 0 00-.03.029c.404-.08.835-.095 1.258-.023 1.979.227 3.528 1.408 4.296 2.923.768 1.516.634 3.313-.374 4.541l.035.07c1.373-1.157 1.821-3.9 1.051-5.41zm-6.627-.852c.266-.271.742-.426 1.341-.355.989.112 1.848.742 2.228 1.487.38.744.316 1.523-.081 2.072a1.862 1.862 0 01-.19.226c.338-.284.582-.676.679-1.145.186-.906-.11-1.841-.758-2.569-.648-.727-1.544-1.094-2.45-1.002-.303.031-.595.109-.861.233-.217.102-.416.23-.59.382l.682.671zM12 0a12 12 0 100 24 12 12 0 000-24zm5.035 18.238c-.368.528-.905.972-1.579 1.278l.006.012c-1.884.708-3.953.511-5.69-.533l-.006-.011c-1.398-.842-2.286-2.18-2.618-3.693-.418-1.9.336-3.826 1.734-4.885.59-.447 1.267-.741 1.983-.861.32-.054.606-.328.606-.653 0-.36-.291-.652-.651-.652-.162 0-.325.029-.473.085-1.042.39-4.873 2.628-4.873 7.828 0 2.2-.006 4.41 1.734 6.136 1.739 1.727 4.053 2.053 6.19 1.637 2.138-.417 3.931-1.743 4.886-3.791.134-.286.01-.628-.276-.761-.286-.134-.627-.01-.762.276z",
    color: "#CC6699",
  },
  {
    name: "Git",
    path: "M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.187 0L8.855 2.478l2.333 2.332c.553-.186 1.185-.068 1.64.385.456.455.574 1.09.386 1.645l2.42 2.42c.553-.188 1.188-.07 1.644.385.604.604.604 1.581 0 2.185-.603.604-1.582.604-2.185 0-.455-.456-.573-1.091-.385-1.646l-2.324-2.324v6.52c.188.082.35.197.477.342.334.333.334.877 0 1.21-.332.334-.877.334-1.21 0-.334-.333-.334-.877 0-1.21.144-.143.305-.246.475-.32V9.124c-.17-.074-.33-.177-.474-.32a1.205 1.205 0 01-.385-1.646L10.96 4.739l-2.112-2.11L.454 12.628c-.604.605-.604 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.422-10.419c.603-.603.603-1.582 0-2.185",
    color: "#F05032",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

const TechStack = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="mb-12 sm:mb-24 py-8 sm:py-12 lg:py-16 px-4 sm:px-8 md:px-12 lg:px-16 border border-foreground/10 bg-foreground/2 rounded-2xl sm:rounded-3xl overflow-hidden relative">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-primary/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="flex flex-col gap-8 sm:gap-12 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-foreground/5 pb-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-[0.2em] uppercase origin-left hover:scale-105 transition-transform cursor-default">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Development Stack
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground leading-none tracking-tighter mb-4">
              The <span className="text-primary">Tech</span> Stack
            </h2>
          </div>
          <div className="lg:max-w-md">
            <p className="text-sm sm:text-base lg:text-lg text-foreground/60 font-medium leading-relaxed italic border-l-2 border-primary/30 pl-4 sm:pl-6">
              We leverage the industry&apos;s most powerful tools to build
              scalable, resilient, and high-performance digital solutions for
              modern businesses.
            </p>
          </div>
        </div>

        <div ref={ref} className="w-full flex justify-center lg:justify-start">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-5 max-w-4xl"
          >
            {techStack.map((tech) => (
              <motion.div
                key={tech.name}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 bg-background/50 border border-foreground/10 hover:border-foreground/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] rounded-full transition-all cursor-default backdrop-blur-md group"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-foreground/50 group-hover:text-(--hover-color) transition-colors duration-300"
                  style={{ "--hover-color": tech.color } as React.CSSProperties}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>{tech.name} logo</title>
                  <path d={tech.path} />
                </svg>
                <span className="text-xs sm:text-sm font-semibold text-foreground/70 group-hover:text-foreground transition-colors duration-300">
                  {tech.name}
                </span>
              </motion.div>
            ))}

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 px-5 py-3 bg-transparent border border-dashed border-foreground/20 hover:border-foreground/40 rounded-full cursor-default text-foreground/50 hover:text-foreground/80 transition-all group"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-xs sm:text-sm font-medium">
                and many more...
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;

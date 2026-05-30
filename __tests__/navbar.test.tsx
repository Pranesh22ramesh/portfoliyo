import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../components/layout/Navbar';

// Mock theme provider hook
jest.mock('@/components/providers/ThemeProvider', () => ({
  useTheme: () => ({
    theme: 'dark',
    toggleTheme: jest.fn(),
  }),
}));

// Mock framer-motion scroll hooks
jest.mock('framer-motion', () => {
  const cleanProps = ({
    children,
    whileHover,
    whileTap,
    initial,
    animate,
    exit,
    transition,
    viewport,
    variants,
    layoutId,
    ...rest
  }: any) => rest;

  return {
    motion: {
      nav: React.forwardRef((props: any, ref: any) => (
        <nav {...cleanProps(props)} ref={ref}>{props.children}</nav>
      )),
      div: React.forwardRef((props: any, ref: any) => (
        <div {...cleanProps(props)} ref={ref}>{props.children}</div>
      )),
      span: React.forwardRef((props: any, ref: any) => (
        <span {...cleanProps(props)} ref={ref}>{props.children}</span>
      )),
      button: React.forwardRef((props: any, ref: any) => (
        <button {...cleanProps(props)} ref={ref}>{props.children}</button>
      )),
    },
    useScroll: () => ({
      scrollY: {
        get: () => 0,
      },
      scrollYProgress: {
        get: () => 0,
      },
    }),
    useMotionValueEvent: jest.fn(),
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe('Navbar Component', () => {
  it('should render the brand logo', () => {
    render(<Navbar />);
    const logoElement = screen.getByText('Pranesh.');
    expect(logoElement).toBeInTheDocument();
  });

  it('should render desktop navigation links', () => {
    render(<Navbar />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Highlights')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });
});

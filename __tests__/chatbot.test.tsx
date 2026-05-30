import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AIChatbot from '../components/ui/AIChatbot';

// Mock ReactMarkdown since it's an ESM package that can cause compiling issues in Jest
jest.mock('react-markdown', () => {
  return function MockMarkdown({ children }: { children: string }) {
    return <span data-testid="markdown">{children}</span>;
  };
});

// Mock framer-motion to bypass animation delays in JSDOM
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
      div: React.forwardRef((props: any, ref: any) => (
        <div {...cleanProps(props)} ref={ref}>{props.children}</div>
      )),
      button: React.forwardRef((props: any, ref: any) => (
        <button {...cleanProps(props)} ref={ref}>{props.children}</button>
      )),
      span: React.forwardRef((props: any, ref: any) => (
        <span {...cleanProps(props)} ref={ref}>{props.children}</span>
      )),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});


describe('AIChatbot Component', () => {
  it('should render the chatbot toggle button', () => {
    render(<AIChatbot />);
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();
  });

  it('should open the chat panel when toggle button is clicked', () => {
    render(<AIChatbot />);
    const toggleButton = screen.getByRole('button');
    
    // Open chat
    fireEvent.click(toggleButton);
    
    // Check if header title is present
    expect(screen.getByText('Ask About Pranesh')).toBeInTheDocument();
    
    // Check if initial message is rendered
    expect(screen.getByText(/I know all about his projects/i)).toBeInTheDocument();
  });

  it('should display quick action chips initially', () => {
    render(<AIChatbot />);
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);

    // Quick actions should be present
    expect(screen.getByText('🚀 Projects')).toBeInTheDocument();
    expect(screen.getByText('⚙️ Skills')).toBeInTheDocument();
    expect(screen.getByText('📜 Certifications')).toBeInTheDocument();
    expect(screen.getByText('📞 Contact')).toBeInTheDocument();
  });
});

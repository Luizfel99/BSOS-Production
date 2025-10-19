/**
 * BSOS Design System Test Page
 * 
 * Interactive showcase of all UI components for testing and validation
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Typography, Heading, Text, Caption } from '@/components/ui/Typography';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const HeartIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

export default function DesignSystemTest() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const handleLoadingTest = () => {
    setIsButtonLoading(true);
    setTimeout(() => setIsButtonLoading(false), 3000);
  };

  return (
    <div className="min-h-screen bg-primary py-8">
      <div className="container mx-auto px-4 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <Heading level={1} color="primary">BSOS Design System</Heading>
          <Text color="secondary" size="base">
            Interactive showcase of unified UI components for the BSOS platform
          </Text>
          <Caption>Phase 9 - Global Visual Design System Implementation</Caption>
        </div>

        {/* Typography Section */}
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <Heading level={2}>Typography</Heading>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              <div>
                <Caption>Display Headings</Caption>
                <div className="space-y-2 mt-2">
                  <Typography variant="display1">Display 1 - Main Headlines</Typography>
                  <Typography variant="display2">Display 2 - Secondary Headlines</Typography>
                  <Typography variant="display3">Display 3 - Tertiary Headlines</Typography>
                </div>
              </div>

              <div>
                <Caption>Standard Headings</Caption>
                <div className="space-y-2 mt-2">
                  <Heading level={1}>Heading 1 - Page Title</Heading>
                  <Heading level={2}>Heading 2 - Section Title</Heading>
                  <Heading level={3}>Heading 3 - Subsection</Heading>
                  <Heading level={4}>Heading 4 - Component Title</Heading>
                  <Heading level={5}>Heading 5 - Small Title</Heading>
                  <Heading level={6}>Heading 6 - Smallest Title</Heading>
                </div>
              </div>

              <div>
                <Caption>Body Text & Utilities</Caption>
                <div className="space-y-2 mt-2">
                  <Text size="base">Body 1 - Regular paragraph text for general content</Text>
                  <Text size="sm">Body 2 - Smaller text for secondary information</Text>
                  <Caption>Caption - Small descriptive text</Caption>
                  <Typography variant="overline">Overline - Uppercase labels</Typography>
                </div>
              </div>

              <div>
                <Caption>Color Variants</Caption>
                <div className="space-y-2 mt-2">
                  <Text color="primary">Primary text color</Text>
                  <Text color="secondary">Secondary text color</Text>
                  <Text color="muted">Muted text color</Text>
                  <Text color="success">Success text color</Text>
                  <Text color="warning">Warning text color</Text>
                  <Text color="error">Error text color</Text>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Button Section */}
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <Heading level={2}>Buttons</Heading>
          </CardHeader>
          <CardBody>
            <div className="space-y-8">
              <div>
                <Caption>Button Variants</Caption>
                <div className="flex flex-wrap gap-3 mt-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>

              <div>
                <Caption>Button Sizes</Caption>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              <div>
                <Caption>Button States</Caption>
                <div className="flex flex-wrap gap-3 mt-3">
                  <Button disabled>Disabled</Button>
                  <Button 
                    isLoading={isButtonLoading}
                    loadingText="Loading..."
                    onClick={handleLoadingTest}
                  >
                    {isButtonLoading ? 'Loading...' : 'Test Loading'}
                  </Button>
                  <Button leftIcon={<SearchIcon />}>With Left Icon</Button>
                  <Button rightIcon={<HeartIcon />}>With Right Icon</Button>
                  <Button fullWidth>Full Width Button</Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Input Section */}
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <Heading level={2}>Input Fields</Heading>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Standard Input"
                  placeholder="Enter your text"
                  helperText="This is helper text"
                />
                <Input
                  label="Input with Error"
                  placeholder="Invalid input"
                  errorMessage="This field is required"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  size="sm"
                  label="Small Size"
                  placeholder="Small input"
                />
                <Input
                  size="md"
                  label="Medium Size"
                  placeholder="Medium input"
                />
                <Input
                  size="lg"
                  label="Large Size"
                  placeholder="Large input"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Search Input"
                  placeholder="Search..."
                  leftIcon={<SearchIcon />}
                />
                <Input
                  label="Success State"
                  placeholder="Valid input"
                  state="success"
                  helperText="Input is valid"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Badge Section */}
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <Heading level={2}>Badges</Heading>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              <div>
                <Caption>Badge Variants</Caption>
                <div className="flex flex-wrap gap-3 mt-3">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </div>

              <div>
                <Caption>Badge Sizes</Caption>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <Badge size="sm">Small</Badge>
                  <Badge size="md">Medium</Badge>
                  <Badge size="lg">Large</Badge>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Alert Section */}
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <Heading level={2}>Alerts</Heading>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <Alert variant="info" title="Information Alert">
                This is an informational message for users.
              </Alert>
              <Alert variant="success" title="Success Alert" dismissible>
                Operation completed successfully!
              </Alert>
              <Alert variant="warning" title="Warning Alert">
                Please review your input before proceeding.
              </Alert>
              <Alert variant="error" title="Error Alert" dismissible>
                An error occurred while processing your request.
              </Alert>
            </div>
          </CardBody>
        </Card>

        {/* Card Variants Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card variant="default" padding="lg">
            <CardHeader>
              <Heading level={3}>Default Card</Heading>
            </CardHeader>
            <CardBody>
              <Text>Standard card with basic shadow and border.</Text>
            </CardBody>
            <CardFooter>
              <Button size="sm" variant="outline">Action</Button>
            </CardFooter>
          </Card>

          <Card variant="elevated" padding="lg">
            <CardHeader>
              <Heading level={3}>Elevated Card</Heading>
            </CardHeader>
            <CardBody>
              <Text>Card with enhanced shadow for more prominence.</Text>
            </CardBody>
            <CardFooter>
              <Button size="sm" variant="primary">Action</Button>
            </CardFooter>
          </Card>

          <Card variant="outlined" padding="lg">
            <CardHeader>
              <Heading level={3}>Outlined Card</Heading>
            </CardHeader>
            <CardBody>
              <Text>Card with border but no shadow for subtle separation.</Text>
            </CardBody>
            <CardFooter>
              <Button size="sm" variant="secondary">Action</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Loading Spinner Section */}
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <Heading level={2}>Loading Indicators</Heading>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              <div>
                <Caption>Spinner Sizes</Caption>
                <div className="flex flex-wrap items-center gap-6 mt-3">
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    <Text size="sm">Small</Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="md" />
                    <Text size="sm">Medium</Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="lg" />
                    <Text size="sm">Large</Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="xl" />
                    <Text size="sm">Extra Large</Text>
                  </div>
                </div>
              </div>

              <div>
                <Caption>Spinner Colors</Caption>
                <div className="flex flex-wrap items-center gap-6 mt-3">
                  <div className="flex items-center gap-2">
                    <LoadingSpinner color="primary" />
                    <Text size="sm">Primary</Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <LoadingSpinner color="secondary" />
                    <Text size="sm">Secondary</Text>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-800 p-2 rounded">
                    <LoadingSpinner color="white" />
                    <Text size="sm" color="inverse">White</Text>
                  </div>
                </div>
              </div>

              <div>
                <Caption>Centered Spinner</Caption>
                <div className="border border-slate-200 rounded h-24 mt-3">
                  <LoadingSpinner centered />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Modal Section */}
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <Heading level={2}>Modal Dialog</Heading>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <Text>Test the modal component with various configurations.</Text>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => setIsModalOpen(true)}>
                  Open Modal
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Modal Component */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="BSOS Modal Test"
          size="md"
        >
          <ModalBody>
            <div className="space-y-4">
              <Text>This is a test modal demonstrating the BSOS design system modal component.</Text>
              <Alert variant="info" title="Modal Features">
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Focus management and keyboard navigation</li>
                  <li>Backdrop click to close (configurable)</li>
                  <li>Escape key to close (configurable)</li>
                  <li>Multiple size options</li>
                  <li>Accessibility features</li>
                </ul>
              </Alert>
              <Input
                label="Test Input in Modal"
                placeholder="Focus management test"
                helperText="This input should receive focus when modal opens"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              Confirm
            </Button>
          </ModalFooter>
        </Modal>

        {/* Footer */}
        <Card variant="ghost" padding="lg">
          <div className="text-center space-y-2">
            <Typography variant="overline">BSOS Design System v2.0</Typography>
            <Caption>
              All components follow accessibility standards and responsive design principles
            </Caption>
          </div>
        </Card>
      </div>
    </div>
  );
}
import { ActionIcon, Card, Flex, Group, Title } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import { PropsWithChildren, ReactNode } from 'react';
import { Link, To } from 'react-router';

type ShellProps = {
  title: ReactNode;
  rightSection?: ReactNode;
  backUrl?: To;
  onBack?: () => void;
  noContentGap?: boolean;
  footer?: ReactNode;
};

export function Shell({
  title,
  children,
  rightSection,
  backUrl,
  onBack,
  noContentGap,
  footer,
}: PropsWithChildren<ShellProps>) {
  return (
    <Card padding="lg" h="100%" style={{ overflow: 'visible' }}>
      <Card.Section
        inheritPadding
        withBorder
        h={64}
        mb={noContentGap ? 0 : 'lg'}
        bg="white"
        style={{ position: 'sticky', top: 0, zIndex: 10 }}
      >
        <Flex h="100%" justify="space-between" align="center" gap="md">
          <Group flex={1} wrap="nowrap" style={{ minWidth: 0 }}>
            {backUrl && !onBack && (
              <ActionIcon
                component={Link}
                variant="subtle"
                to={backUrl}
                style={{ flexShrink: 0 }}
              >
                <IconChevronLeft />
              </ActionIcon>
            )}
            {backUrl && onBack && (
              <ActionIcon
                variant="subtle"
                onClick={onBack}
                style={{ flexShrink: 0 }}
              >
                <IconChevronLeft />
              </ActionIcon>
            )}
            <Title
              order={3}
              flex={1}
              style={{
                minWidth: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {title}
            </Title>
          </Group>
          {rightSection}
        </Flex>
      </Card.Section>

      {footer ? (
        <div className="shell-content-with-footer">{children}</div>
      ) : (
        children
      )}

      {footer && (
        <Card.Section
          inheritPadding
          withBorder
          py="sm"
          bg="white"
          className="shell-footer"
        >
          {footer}
        </Card.Section>
      )}
    </Card>
  );
}

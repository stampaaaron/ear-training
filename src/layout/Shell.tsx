import { ActionIcon, Card, Flex, Group, Title } from '@mantine/core';
import { IconChevronLeft, IconSettings } from '@tabler/icons-react';
import { PropsWithChildren, ReactNode } from 'react';
import { Link } from 'react-router';

type ShellProps = {
  title: string;
  rightSection?: ReactNode;
  backUrl?: string;
};

export function Shell({
  title,
  children,
  rightSection = (
    <ActionIcon component={Link} variant="subtle" to="/settings">
      <IconSettings />
    </ActionIcon>
  ),
  backUrl,
}: PropsWithChildren<ShellProps>) {
  return (
    <Card padding="lg" h="100%">
      <Card.Section inheritPadding withBorder py="sm" mb="lg">
        <Flex justify="space-between" align="center">
          <Group>
            {backUrl && (
              <ActionIcon component={Link} variant="subtle" to={backUrl}>
                <IconChevronLeft />
              </ActionIcon>
            )}
            <Title order={3}>{title}</Title>
          </Group>
          {rightSection}
        </Flex>
      </Card.Section>

      {children}
    </Card>
  );
}

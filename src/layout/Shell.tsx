import { ActionIcon, Card, Flex, Group, Title } from '@mantine/core';
import { IconChevronLeft, IconSettings } from '@tabler/icons-react';
import { PropsWithChildren } from 'react';
import { Link } from 'react-router';

type ShellProps = {
  title: string;
  backUrl?: string;
};

export function Shell({
  title,
  children,
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
          <ActionIcon component={Link} variant="subtle" to="/settings">
            <IconSettings />
          </ActionIcon>
        </Flex>
      </Card.Section>

      {children}
    </Card>
  );
}

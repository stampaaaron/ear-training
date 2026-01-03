import { ActionIcon, Card, Flex, Group, Title } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import { PropsWithChildren, ReactNode } from 'react';
import { Link, To } from 'react-router';

type ShellProps = {
  title: ReactNode;
  rightSection?: ReactNode;
  backUrl?: To;
};

export function Shell({
  title,
  children,
  rightSection,
  backUrl,
}: PropsWithChildren<ShellProps>) {
  return (
    <Card padding="lg" h="100%">
      <Card.Section inheritPadding withBorder py="sm" mb="lg">
        <Flex justify="space-between" align="center" gap="md">
          <Group flex={1}>
            {backUrl && (
              <ActionIcon component={Link} variant="subtle" to={backUrl}>
                <IconChevronLeft />
              </ActionIcon>
            )}
            <Title order={3} flex={1}>
              {title}
            </Title>
          </Group>
          {rightSection}
        </Flex>
      </Card.Section>

      {children}
    </Card>
  );
}

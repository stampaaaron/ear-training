import { Card, Title } from '@mantine/core';
import { PropsWithChildren } from 'react';

type ShellProps = {
  title: string;
};

export function Shell({ title, children }: PropsWithChildren<ShellProps>) {
  return (
    <Card padding="lg">
      <Card.Section inheritPadding withBorder py="sm" mb="lg">
        <Title order={3}>{title}</Title>
      </Card.Section>

      {children}
    </Card>
  );
}

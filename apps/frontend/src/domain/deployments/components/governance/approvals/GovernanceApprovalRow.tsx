import { useNavigate } from 'react-router';
import {
  PMBadge,
  PMBox,
  PMHStack,
  PMIcon,
  PMText,
  PMVStack,
} from '@packmind/ui';
import { IconType } from 'react-icons';
import {
  LuBookCheck,
  LuChevronRight,
  LuTerminal,
  LuWandSparkles,
} from 'react-icons/lu';
import { formatRelativeDate } from '../../redesign/selectors/installDriftEntries';
import { routes } from '../../../../../shared/utils/routes';
import type {
  ApprovalArtefactType,
  ApprovalEntry,
} from './stubApprovalEntries';

const CARD_INSET = 5;

const ARTEFACT_TYPE_ICON: Record<ApprovalArtefactType, IconType> = {
  standards: LuBookCheck,
  commands: LuTerminal,
  skills: LuWandSparkles,
};

interface GovernanceApprovalRowProps {
  entry: ApprovalEntry;
  orgSlug: string;
  isLast: boolean;
}

export function GovernanceApprovalRow({
  entry,
  orgSlug,
  isLast,
}: Readonly<GovernanceApprovalRowProps>) {
  const navigate = useNavigate();
  const TypeIcon = ARTEFACT_TYPE_ICON[entry.artefactType];
  const isDeletion = entry.kind === 'deletion';
  const href =
    entry.kind === 'creation'
      ? routes.space.toReviewChangesCreation(
          orgSlug,
          entry.spaceSlug,
          entry.artefactType,
          entry.id,
        )
      : routes.space.toReviewChangesArtefact(
          orgSlug,
          entry.spaceSlug,
          entry.artefactType,
          entry.artefactId,
        );
  const actionLabel =
    entry.kind === 'creation'
      ? 'Review new'
      : isDeletion
        ? 'Review removal of'
        : 'Review changes to';

  return (
    <PMBox
      as="button"
      onClick={() => navigate(href)}
      aria-label={`${actionLabel} ${entry.artefactName} in space ${entry.spaceName}`}
      role="group"
      width="full"
      bg="transparent"
      border="none"
      borderBottomWidth={isLast ? '0' : '1px'}
      borderColor="border.tertiary"
      paddingX={CARD_INSET}
      paddingY={3}
      minHeight="60px"
      cursor="pointer"
      textAlign="left"
      transition="background-color 120ms ease-out"
      _hover={{ bg: 'background.tertiary' }}
      _focusVisible={{
        outline: '2px solid',
        outlineColor: 'border.brand',
        outlineOffset: '-2px',
      }}
    >
      <PMHStack gap={4} align="center" justify="space-between" height="full">
        <PMVStack align="stretch" gap={0.5} minW={0} flex={1}>
          <PMHStack gap={2.5} align="center" minW={0}>
            <PMIcon color="text.faded" fontSize="md" flexShrink={0} aria-hidden>
              <TypeIcon />
            </PMIcon>
            <PMText
              fontSize="md"
              fontWeight="medium"
              color="primary"
              textDecoration={isDeletion ? 'line-through' : undefined}
              truncate
              minW={0}
            >
              {entry.artefactName}
            </PMText>
            {entry.kind === 'creation' && (
              <PMBadge
                size="xs"
                variant="subtle"
                colorPalette="green"
                flexShrink={0}
              >
                new
              </PMBadge>
            )}
            {isDeletion && (
              <PMBadge
                size="xs"
                variant="subtle"
                colorPalette="red"
                flexShrink={0}
              >
                removed
              </PMBadge>
            )}
          </PMHStack>
          <PMText fontSize="sm" color="tertiary" truncate minW={0}>
            {entry.summary}
          </PMText>
        </PMVStack>
        <PMHStack gap={5} align="center" flexShrink={0}>
          <PMText fontSize="xs" color="faded" truncate maxW="160px">
            {entry.proposedBy}
          </PMText>
          <PMText fontSize="xs" color="faded" fontVariantNumeric="tabular-nums">
            {formatRelativeDate(entry.proposedAt)}
          </PMText>
          <PMIcon
            color="text.faded"
            fontSize="md"
            transition="color 120ms ease-out, transform 120ms ease-out"
            _groupHover={{
              color: 'text.primary',
              transform: 'translateX(2px)',
            }}
          >
            <LuChevronRight />
          </PMIcon>
        </PMHStack>
      </PMHStack>
    </PMBox>
  );
}

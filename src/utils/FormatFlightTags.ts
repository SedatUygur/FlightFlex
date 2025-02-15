export const formatFlightTags = (tags: string[], joinedBy = ', '): string =>
  tags
    .map(
      (tag) =>
        tag.charAt(0).toUpperCase() + tag.replace(/_/g, ' ').slice(1).toLowerCase(),
    )
    .join(joinedBy);

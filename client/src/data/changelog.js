const changelog = [];

export default changelog;

export const getLatestVersion = () => changelog[0]?.version || '1.0.0';

export const getLatestChanges = () => changelog[0]?.changes?.slice(0, 3) || [];

import { otherMessage } from 'logger';

export const getMessage = (): string => {
	return 'this is the message 6 ' + otherMessage();
}

/* // add all jest-extended matchers
import * as matchers from 'jest-extended';
expect.extend(matchers); */

// or just add specific matchers
import { toIncludeAllMembers } from 'jest-extended';
expect.extend({ toIncludeAllMembers });
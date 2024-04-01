// react-testing-library renders your components to document.body,
// this adds jest-dom's custom assertions
// workaround: https://github.com/testing-library/jest-dom/issues/427#issuecomment-1110985202
import "@testing-library/jest-dom";
import createFetchMock from "vitest-fetch-mock";
import { vi } from "vitest";

const fetchMocker = createFetchMock(vi);

// sets globalThis.fetch and globalThis.fetchMock to our mocked version
fetchMocker.enableMocks();

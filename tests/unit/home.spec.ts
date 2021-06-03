import { mount } from "@vue/test-utils";
import Home from "@/views/Home.vue";

const wrapper = mount(Home);

describe("Home.vue", () => {
  it("component is rendered", () => {
    expect(wrapper.contains("div"));
  });
  it("contains content", () => {
    const home = wrapper.find(".home");
    expect(home.contains("div .content")).toBe(true);
  });
  it("contains plants", () => {
    const content = wrapper.find(".content");
    const plants = content.findAll("div");
    expect(plants.length).toBeGreaterThanOrEqual(1);
  });
});

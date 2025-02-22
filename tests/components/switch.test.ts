import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import UiSwitch from "../../components/ui/switch.vue"; // Ajustez le chemin selon l'emplacement de votre composant

describe("UiSwitch.vue", () => {
  it("renders left and right text correctly", () => {
    const leftText = "Gauche";
    const rightText = "Droite";
    const wrapper = mount(UiSwitch, {
      props: {
        leftText,
        rightText,
      },
    });

    expect(wrapper.text()).toContain(leftText);
    expect(wrapper.text()).toContain(rightText);
  });

  it("changes active side on click", async () => {
    const leftText = "Gauche";
    const rightText = "Droite";
    const wrapper = mount(UiSwitch, {
      props: {
        leftText,
        rightText,
      },
    });

    // Vérifiez que le côté gauche est actif initialement
    expect(wrapper.find(".switch-side.left").classes()).toContain("active");

    // Cliquez sur le côté droit
    await wrapper.find(".switch-side.right").trigger("click");

    // Vérifiez que le côté droit est maintenant actif
    expect(wrapper.find(".switch-side.right").classes()).toContain("active");
    expect(wrapper.find(".switch-side.left").classes()).not.toContain("active");
  });
});

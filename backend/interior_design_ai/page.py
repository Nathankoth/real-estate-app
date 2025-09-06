import streamlit as st

def generate_design(image, prompt):
    # Placeholder: returns a sample image URL
    return "https://images.unsplash.com/photo-1506744038136-46273834b3fb"

def show_interior_design_ai():
    st.title("Interior Design AI")
    st.header("AI-Powered Suggestions")
    st.write("Upload a room image or describe your ideal room:")

    col1, col2 = st.columns(2)
    with col1:
        uploaded_image = st.file_uploader("Upload Room Image", type=["jpg", "jpeg", "png"])
    with col2:
        prompt = st.text_area("Describe your ideal room")

    if st.button("Generate Design"):
        result_image_url = generate_design(uploaded_image, prompt)
        st.subheader("AI-Generated Design (Sample)")
        st.image(result_image_url, caption="Sample Room Design", use_column_width=True)

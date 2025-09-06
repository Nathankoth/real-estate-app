import streamlit as st
import plotly.graph_objects as go

def show_3d_architecture_preview():
    st.title("3D Architecture Preview")
    st.header("Visualize Your Space")
    st.write("Interact with a placeholder 3D model below:")

    # Simple cube model
    fig = go.Figure(data=[
        go.Mesh3d(
            x=[0, 1, 1, 0, 0, 1, 1, 0],
            y=[0, 0, 1, 1, 0, 0, 1, 1],
            z=[0, 0, 0, 0, 1, 1, 1, 1],
            color='lightblue',
            opacity=0.5
        )
    ])
    fig.update_layout(
        scene=dict(
            xaxis=dict(visible=False),
            yaxis=dict(visible=False),
            zaxis=dict(visible=False)
        ),
        margin=dict(l=0, r=0, b=0, t=0)
    )
    st.plotly_chart(fig, use_container_width=True)
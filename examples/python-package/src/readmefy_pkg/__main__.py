import click


@click.command()
def main() -> None:
    """Run the package entrypoint."""
    click.echo("readmefy-pkg is ready.")


if __name__ == "__main__":
    main()
